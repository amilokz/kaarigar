'use client';

import { useEffect, useRef, useState } from 'react';
import { AREAS, CATEGORIES, useBot, useLang } from '@/lib/i18n';
import { addWorker, avatarColor, initials, type Worker } from '@/lib/workers';
import { Avatar, SimBadge } from '@/components/WorkerCard';
import { Check, Mic, Send, WhatsAppGlyph } from '@/components/icons';

type Msg = { from: 'bot' | 'user'; text: string; time: string };
type Profile = { name: string; skill: string; area: string; rate: string; avail: boolean | null };

const SKILL_KEYS: [string, string[]][] = [
  ['painter', ['painter', 'rang', 'paint']],
  ['electrician', ['electrician', 'bijli', 'wire', 'wiring', 'pankha', 'switch']],
  ['plumber', ['plumber', 'nalka', 'pipe', 'sanitary', 'tank']],
  ['mason', ['mason', 'raj mistry', 'rajmistri', 'deewar', 'tile', 'plaster']],
  ['carpenter', ['carpenter', 'barhai', 'badhai', 'lakri', 'furniture', 'wood']],
  ['ac-tech', ['ac technician', 'ac tech', 'air conditioner']],
];

const now = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

function detectSkill(text: string): string | null {
  const t = ` ${text.toLowerCase()} `;
  for (const [id, keys] of SKILL_KEYS) {
    if (keys.some((k) => new RegExp(`\\b${k}\\b`).test(t))) return id;
  }
  return null;
}

function detectArea(text: string): string | null {
  const t = text.toLowerCase();
  for (const a of AREAS) if (t.includes(a.toLowerCase())) return a;
  if (/\bdha\b/.test(t)) return 'DHA Phase 2';
  return null;
}

function detectRate(text: string): string | null {
  const m = text.replace(/,/g, '').match(/(\d{3,6})/);
  if (!m) return null;
  const v = parseInt(m[1], 10);
  return v >= 500 && v <= 50000 ? String(v) : null;
}

function detectAvail(text: string): boolean | null {
  const t = ` ${text.toLowerCase()} `;
  if (/\b(haan|han|jee|ji|yes|free|available|azaad)\b/.test(t)) return true;
  if (/\b(nahi|nahin|nahein|no|busy|masroof)\b/.test(t)) return false;
  return null;
}

function extractName(text: string): string {
  let s = text.trim();
  s = s.replace(/^(mera naam|my name is|main|mein|i am|i'm)\s+/i, '');
  s = s.replace(/\s+(hai|hoon|hun|ho)\.?$/i, '');
  const words = s.split(/\s+/).filter(Boolean).slice(0, 3).join(' ');
  return words.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
}

export default function OnboardPage() {
  const { t, catName } = useLang();
  const bot = useBot();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [profile, setProfile] = useState<Profile>({ name: '', skill: '', area: '', rate: '', avail: null });
  const [done, setDone] = useState(false);
  const [listening, setListening] = useState(false);
  const [speakOn, setSpeakOn] = useState(false);
  const [srOK, setSrOK] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const recogRef = useRef<{ stop: () => void } | null>(null);

  // greet once
  useEffect(() => {
    setMsgs([{ from: 'bot', text: bot.greet, time: now() }]);
    try {
      const w = window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown };
      setSrOK(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
    } catch { setSrOK(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, typing]);

  const speak = (text: string) => {
    if (!speakOn) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ur-PK';
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    } catch { /* ignore */ }
  };

  const askFor = (p: Profile): string => {
    if (!p.name) return bot.greet;
    if (!p.skill) return bot.skill(p.name.split(' ')[0]);
    if (!p.area) return bot.area;
    if (!p.rate) return bot.rate;
    if (p.avail === null) return bot.avail;
    return '';
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing || done) return;
    setMsgs((m) => [...m, { from: 'user', text, time: now() }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setProfile((prev) => {
        const p = { ...prev };
        // harvest whatever we can from free-form text
        if (!p.name) {
          const n = extractName(text);
          if (n && n.length >= 2) p.name = n;
        }
        const sk = detectSkill(text); if (sk && !p.skill) p.skill = sk;
        const ar = detectArea(text); if (ar && !p.area) p.area = ar;
        const rt = detectRate(text); if (rt && !p.rate) p.rate = rt;
        const av = detectAvail(text); if (av !== null && p.avail === null) p.avail = av;

        const next = askFor(p);
        if (!next) {
          // complete → save worker (pending admin verification)
          const w: Worker = {
            id: `w-reg-${Date.now()}`,
            name: p.name || 'Naameless',
            category: p.skill,
            area: p.area,
            rate: parseInt(p.rate, 10),
            rating: 5,
            jobs: 0,
            availableToday: p.avail === true,
            verified: false,
            experience: 1,
            phone: '03XX-XXXXXXX',
            cnic: 'XXXXX-XXXXXXX-X',
            skills: [catName(p.skill)],
            reviews: [],
            about: 'WhatsApp ke zariye register (demo).',
            source: 'whatsapp',
            status: 'pending',
          };
          addWorker(w);
          setDone(true);
          const doneMsg = `${t('registered')}\n${t('registeredSub')}`;
          setMsgs((m) => [...m, { from: 'bot', text: doneMsg, time: now() }]);
          speak(t('registered'));
        } else {
          const understood = p.name || sk || ar || rt || av !== null;
          const reply = understood ? next : bot.unknown;
          setMsgs((m) => [...m, { from: 'bot', text: reply, time: now() }]);
          speak(reply);
        }
        setTyping(false);
        return p;
      });
    }, 900);
  };

  const toggleMic = () => {
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    try {
      const w = window as unknown as {
        SpeechRecognition?: new () => {
          lang: string; interimResults: boolean;
          onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
          onend: (() => void) | null; start: () => void; stop: () => void;
        };
        webkitSpeechRecognition?: new () => {
          lang: string; interimResults: boolean;
          onresult: ((e: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
          onend: (() => void) | null; start: () => void; stop: () => void;
        };
      };
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (!SR) { setSrOK(false); return; }
      const rec = new SR();
      rec.lang = 'ur-PK';
      rec.interimResults = false;
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) send(transcript);
      };
      rec.onend = () => setListening(false);
      recogRef.current = rec;
      rec.start();
      setListening(true);
    } catch { setSrOK(false); }
  };

  const reset = () => {
    setMsgs([{ from: 'bot', text: bot.greet, time: now() }]);
    setProfile({ name: '', skill: '', area: '', rate: '', avail: null });
    setDone(false);
    setInput('');
  };

  const fields = [
    { label: t('fName'), value: profile.name || '—' },
    { label: t('fSkill'), value: profile.skill ? catName(profile.skill) : '—' },
    { label: t('fArea'), value: profile.area || '—' },
    { label: t('fRate'), value: profile.rate ? `PKR ${profile.rate}` : '—' },
    { label: t('availableToday'), value: profile.avail === null ? '—' : profile.avail ? '✓' : '✗' },
  ];
  const filled = [profile.name, profile.skill, profile.area, profile.rate, profile.avail !== null].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-stone-900">{t('onboardTitle')}</h1>
        <p className="mt-1 text-sm text-stone-600">{t('onboardSub')}</p>
        <div className="mt-2"><SimBadge /></div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT — WhatsApp-style chat */}
        <section className="overflow-hidden rounded-[1.75rem] shadow-[0_24px_50px_-20px_rgba(28,25,23,0.35)] ring-1 ring-stone-200" aria-label="WhatsApp simulation">
          <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <WhatsAppGlyph className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-extrabold">{t('chatTitle')}</p>
              <p className="text-xs text-white/70">{t('online')}</p>
            </div>
            <button
              onClick={() => setSpeakOn((v) => !v)}
              title="Bot voice"
              className={`rounded-full px-3 py-1.5 text-xs font-bold ${speakOn ? 'bg-white text-[#075e54]' : 'bg-white/15 text-white'}`}
            >
              🔊 {speakOn ? 'ON' : 'OFF'}
            </button>
          </div>

          <div ref={chatRef} className="wa-bg chat-scroll h-96 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl p-3 text-sm shadow ${
                    m.from === 'user'
                      ? 'rounded-br-sm bg-[#d9fdd3] text-stone-900'
                      : 'rounded-bl-sm bg-white text-stone-900'
                  }`}
                >
                  <p>{m.text}</p>
                  <p className="mt-1 text-right text-[10px] text-stone-400">
                    {m.time} {m.from === 'user' && '✓✓'}
                  </p>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white p-3 shadow">
                  <span className="typing-dot h-2 w-2 rounded-full bg-stone-400" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-stone-400" />
                  <span className="typing-dot h-2 w-2 rounded-full bg-stone-400" />
                </div>
              </div>
            )}
          </div>

          {!done ? (
            <div className="bg-[#f0f0f0] p-3">
              <p className="mb-2 text-xs font-semibold text-stone-500">{t('quickHint')}</p>
              <div className="mb-2 flex flex-wrap gap-2">
                {[t('quick1'), t('quick2')].map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#075e54] shadow transition hover:bg-green-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => { e.preventDefault(); send(input); }}
              >
                <button
                  type="button"
                  onClick={toggleMic}
                  disabled={!srOK}
                  title={t('micBtn')}
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow transition ${
                    listening ? 'animate-pulse bg-red-600' : 'bg-[#075e54] hover:bg-[#064e46]'
                  } ${!srOK ? 'opacity-40' : ''}`}
                >
                  <Mic />
                </button>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={listening ? t('micListening') : t('typeMsg')}
                  className="h-11 flex-1 rounded-full bg-white px-4 text-sm outline-none"
                />
                <button
                  type="submit"
                  title={t('sendBtn')}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#075e54] text-white shadow transition hover:bg-[#064e46]"
                >
                  <Send />
                </button>
              </form>
              {!srOK && <p className="mt-1.5 text-xs text-stone-500">{t('micUnsupported')}</p>}
            </div>
          ) : (
            <div className="bg-[#f0f0f0] p-4 text-center">
              <button onClick={reset} className="rounded-full bg-[#075e54] px-6 py-2.5 text-sm font-bold text-white">
                ↺ {t('regAgain')}
              </button>
            </div>
          )}
        </section>

        {/* RIGHT — live profile */}
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-stone-900">{t('liveProfile')}</h2>
            <span className="text-xs font-bold text-stone-500">{filled}/5</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-100">
            <div className="h-full rounded-full bg-orange-600 transition-all" style={{ width: `${(filled / 5) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs text-stone-500">{t('profileHint')}</p>

          <div className="mt-5 flex items-center gap-4 rounded-2xl bg-stone-900 p-5 text-white">
            <span className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-black text-white ${avatarColor(profile.name || '?')}`}>
              {profile.name ? initials(profile.name) : '?'}
            </span>
            <div>
              <p className="text-lg font-black">{profile.name || '—'}</p>
              <p className="text-sm font-bold text-orange-400">{profile.skill ? catName(profile.skill) : '—'}</p>
              <p className={`mt-1 text-xs font-bold ${profile.avail ? 'text-green-400' : 'text-stone-400'}`}>
                {profile.avail === null ? '—' : profile.avail ? `● ${t('availableToday')}` : `○ ${t('notToday')}`}
              </p>
            </div>
          </div>

          <dl className="mt-4 space-y-2">
            {fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between rounded-xl bg-stone-100 px-4 py-2.5 text-sm">
                <dt className="font-bold text-stone-500">{f.label}</dt>
                <dd className="flex items-center gap-2 font-extrabold text-stone-900">
                  {f.value !== '—' && <Check className="h-4 w-4 text-green-600" />}
                  {f.value}
                </dd>
              </div>
            ))}
          </dl>

          {done && (
            <div className="mt-4 rounded-2xl bg-green-50 p-4 text-center">
              <p className="text-sm font-extrabold text-green-800">{t('registered')}</p>
              <p className="mt-1 text-xs text-green-700">{t('registeredSub')}</p>
            </div>
          )}
        </section>
      </div>

      <p className="text-xs text-stone-400">
        {CATEGORIES.map((c) => catName(c.id)).join(' · ')} — keyword matching demo, no real AI.
      </p>
    </div>
  );
}
