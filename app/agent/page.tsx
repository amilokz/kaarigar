'use client';

import { useMemo, useState } from 'react';
import { AREAS, CATEGORIES, useLang } from '@/lib/i18n';
import { addWorker, avatarColor, getBookings, getWorkers, initials, type Worker } from '@/lib/workers';
import { load } from '@/lib/store';
import { Avatar } from '@/components/WorkerCard';
import { Check } from '@/components/icons';

export default function AgentPage() {
  const { t, catName } = useLang();
  const [tab, setTab] = useState<'register' | 'dashboard'>('register');

  const [name, setName] = useState('');
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('painter');
  const [area, setArea] = useState(AREAS[0]);
  const [rate, setRate] = useState('2500');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const workers = useMemo(() => getWorkers(), [msg]);
  const mine = workers.filter((w) => w.source === 'agent' || w.source === 'whatsapp');
  const pending = mine.filter((w) => w.status === 'pending').length;
  const commissionRate = load<number>('commission-rate', 5);
  const regFee = load<number>('reg-fee', 200);
  const bookings = typeof window === 'undefined' ? [] : getBookings();
  const bookingCommission = bookings
    .filter((b) => mine.some((w) => w.id === b.workerId))
    .reduce((s) => s + Math.round(2500 * commissionRate / 100), 0);
  const regCommission = mine.length * regFee;
  const total = regCommission + bookingCommission;

  const submit = () => {
    if (!name.trim() || !phone.trim()) {
      setMsg({ ok: false, text: t('needFields') });
      return;
    }
    const w: Worker = {
      id: `w-agent-${Date.now()}`,
      name: name.trim(),
      category: skill,
      area,
      rate: parseInt(rate, 10) || 2500,
      rating: 5,
      jobs: 0,
      availableToday: true,
      verified: false,
      experience: 1,
      phone: phone.trim(),
      cnic: cnic.trim() || 'XXXXX-XXXXXXX-X',
      skills: [catName(skill)],
      reviews: [],
      about: 'Field agent ke zariye register (demo).',
      source: 'agent',
      status: 'pending',
    };
    addWorker(w);
    setMsg({ ok: true, text: t('regSuccess') });
    setName(''); setCnic(''); setPhone(''); setRate('2500'); setPhotoUrl(null);
  };

  const inputCls =
    'w-full rounded-2xl border-2 border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 outline-none focus:border-orange-500';

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-stone-900">🧑‍💼 {t('agentTitle')}</h1>
        <p className="mt-1 text-sm text-stone-600">{t('agentSub')}</p>
      </div>

      <div className="flex gap-2">
        {(['register', 'dashboard'] as const).map((k) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className={`rounded-full px-5 py-2.5 text-sm font-extrabold transition ${
              tab === k ? 'bg-orange-600 text-white shadow' : 'bg-white text-stone-600 shadow-sm hover:bg-stone-100'
            }`}
          >
            {k === 'register' ? t('tabRegister') : t('tabDashboard')}
          </button>
        ))}
      </div>

      {tab === 'register' && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-4">
            <span className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-black text-white ${avatarColor(name || '?')}`}>
              {name ? initials(name) : '?'}
            </span>
            <label className="cursor-pointer rounded-full bg-stone-100 px-4 py-2 text-sm font-bold text-stone-700 transition hover:bg-stone-200">
              📷 {t('fPhoto')}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setPhotoUrl(URL.createObjectURL(f));
                }}
              />
            </label>
            {photoUrl && <img src={photoUrl} alt="preview" className="h-16 w-16 rounded-full object-cover" />}
          </div>
          <p className="mb-4 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">{t('photoNote')}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">{t('fName')} *</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Muhammad Aslam" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">{t('fPhone')} *</span>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="0300-1234567" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">{t('fCnic')}</span>
              <input value={cnic} onChange={(e) => setCnic(e.target.value)} className={inputCls} placeholder="35202-1234567-1" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">{t('fRate')}</span>
              <input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="numeric" className={inputCls} placeholder="2500" />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">{t('fSkill')}</span>
              <select value={skill} onChange={(e) => setSkill(e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{catName(c.id)}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-stone-500">{t('fArea')}</span>
              <select value={area} onChange={(e) => setArea(e.target.value)} className={inputCls}>
                {AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </label>
          </div>

          {msg && (
            <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-bold ${msg.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`} role="status">
              {msg.ok ? '✅ ' : '⚠ '}{msg.text}
            </p>
          )}

          <button onClick={submit} className="mt-5 w-full rounded-full bg-orange-600 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-orange-500">
            {t('registerWorker')}
          </button>
        </section>
      )}

      {tab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-stone-900 p-5 text-white">
              <p className="text-3xl font-black text-orange-400">{mine.length}</p>
              <p className="mt-1 text-xs font-bold text-stone-400">{t('dashWorkers')}</p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-3xl font-black text-amber-600">{pending}</p>
              <p className="mt-1 text-xs font-bold text-stone-500">{t('dashPending')}</p>
            </div>
            <div className="rounded-3xl bg-green-700 p-5 text-white">
              <p className="text-3xl font-black">PKR {total.toLocaleString()}</p>
              <p className="mt-1 text-xs font-bold text-green-200">{t('dashCommission')}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="text-sm font-extrabold text-stone-900">Commission breakdown (demo)</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between rounded-xl bg-stone-100 px-4 py-2.5">
                <span className="font-semibold text-stone-600">{t('perReg')} × {mine.length}</span>
                <b>PKR {regCommission.toLocaleString()}</b>
              </div>
              <div className="flex justify-between rounded-xl bg-stone-100 px-4 py-2.5">
                <span className="font-semibold text-stone-600">{t('perBooking')}</span>
                <b>PKR {bookingCommission.toLocaleString()}</b>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {mine.length === 0 && (
              <p className="rounded-3xl bg-white p-6 text-center text-sm font-semibold text-stone-500 shadow-sm">
                {t('tabRegister')} → {t('registerWorker')}
              </p>
            )}
            {mine.map((w) => (
              <div key={w.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
                <Avatar name={w.name} size="h-11 w-11 text-sm" />
                <div className="flex-1">
                  <p className="text-sm font-extrabold text-stone-900">{w.name}</p>
                  <p className="text-xs text-stone-500">{catName(w.category)} · {w.area}</p>
                </div>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                  w.status === 'approved' ? 'bg-green-100 text-green-800' : w.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {w.status === 'approved' && <Check className="h-3 w-3" />}
                  {w.status === 'approved' ? t('approved') : w.status === 'rejected' ? t('rejected') : t('pending')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
