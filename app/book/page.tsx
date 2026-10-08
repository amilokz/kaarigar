'use client';

import { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { addBooking, addComplaint, getWorker, updateBooking, type Booking } from '@/lib/workers';
import { Avatar, SimBadge } from '@/components/WorkerCard';
import { Check, WhatsAppGlyph } from '@/components/icons';

const COMMON_JOBS: Record<string, string[]> = {
  electrician: ['Pankha lagwana', 'Switch board repair', 'Wiring check', 'UPS fitting'],
  plumber: ['Nalka repair', 'Pipe leakage', 'Tank saaf karna', 'Sanitary fitting'],
  painter: ['Kamra paint', 'Putty + paint', 'Polish', 'Exterior paint'],
  mason: ['Tile lagwana', 'Plaster', 'Deewar repair', 'Marble polish'],
  carpenter: ['Darwaza repair', 'Almari banana', 'Kitchen shelf', 'Furniture polish'],
  'ac-tech': ['AC service', 'Gas refill', 'AC install', 'AC repair'],
};

const SLOTS = ['09:00', '11:00', '13:00', '15:00', '17:00'];

function BookInner() {
  const { t, catName } = useLang();
  const params = useSearchParams();
  const worker = getWorker(params.get('worker') ?? '');

  const [step, setStep] = useState(0);
  const [job, setJob] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [err, setErr] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);
  const [complaintOpen, setComplaintOpen] = useState(false);
  const [complaintText, setComplaintText] = useState('');
  const [complaintDone, setComplaintDone] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const stages = [t('stageBooked'), t('stageOnWay'), t('stageDone'), t('stageRate')];

  if (!worker) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <p className="text-lg font-bold text-stone-600">{t('noResults')}</p>
        <Link href="/workers" className="mt-4 inline-block font-bold text-orange-700 underline">← {t('back')}</Link>
      </div>
    );
  }

  const confirm = () => {
    const b: Booking = {
      ref: `KG-${Math.floor(1000 + Math.random() * 9000)}`,
      workerId: worker.id,
      workerName: worker.name,
      category: worker.category,
      area: worker.area,
      job,
      date,
      time,
      stage: 0,
      rating: null,
      createdAt: new Date().toISOString(),
      paymentMethod: 'Cash',
      paid: false,
    };
    addBooking(b);
    setBooking(b);
    setStep(3);
  };

  const advance = () => {
    if (!booking || booking.stage >= 3) return;
    const next = booking.stage + 1;
    updateBooking(booking.ref, { stage: next });
    setBooking({ ...booking, stage: next });
  };

  const submitRating = (r: number) => {
    if (!booking) return;
    setRating(r);
    setRated(true);
    updateBooking(booking.ref, { rating: r });
    setBooking({ ...booking, rating: r });
  };

  const sendComplaint = () => {
    if (!booking || !complaintText.trim()) return;
    addComplaint({
      id: `c-${Date.now()}`,
      ref: booking.ref,
      name: 'Demo Customer',
      text: complaintText.trim(),
      createdAt: new Date().toISOString(),
      resolved: false,
    });
    setComplaintDone(true);
    setComplaintText('');
  };

  const stepTitles = [t('stepDescribe'), t('stepWhen'), t('stepConfirm')];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm">
        <Avatar name={worker.name} size="h-14 w-14 text-lg" />
        <div>
          <h1 className="text-xl font-black text-stone-900">{t('bookTitle')}</h1>
          <p className="text-sm font-semibold text-stone-600">
            {worker.name} · {catName(worker.category)} · PKR {worker.rate.toLocaleString()}{t('perDay')}
          </p>
        </div>
      </div>

      {step < 3 && (
        <ol className="flex items-center gap-2">
          {stepTitles.map((s, i) => (
            <li key={s} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black ${
                  i === step ? 'bg-orange-600 text-white' : i < step ? 'bg-green-600 text-white' : 'bg-stone-200 text-stone-500'
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={`hidden text-xs font-bold sm:block ${i === step ? 'text-stone-900' : 'text-stone-400'}`}>{s}</span>
              {i < stepTitles.length - 1 && <span className="h-0.5 flex-1 bg-stone-200" />}
            </li>
          ))}
        </ol>
      )}

      {err && <p className="rounded-xl bg-red-100 px-4 py-2 text-sm font-bold text-red-700" role="alert">{err}</p>}

      {/* STEP 1 — describe */}
      {step === 0 && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-extrabold text-stone-900">{t('describeLabel')}</label>
          <textarea
            value={job}
            onChange={(e) => setJob(e.target.value)}
            placeholder={t('describePlaceholder')}
            rows={4}
            className="w-full rounded-2xl border-2 border-stone-200 p-4 text-sm outline-none focus:border-orange-500"
          />
          <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-stone-500">{t('commonJobs')}</p>
          <div className="flex flex-wrap gap-2">
            {(COMMON_JOBS[worker.category] ?? []).map((j) => (
              <button
                key={j}
                onClick={() => setJob((prev) => (prev ? prev + ' • ' + j : j))}
                className="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-semibold text-stone-700 transition hover:bg-orange-100 hover:text-orange-800"
              >
                + {j}
              </button>
            ))}
          </div>
          <button
            onClick={() => { if (!job.trim()) { setErr(t('needDescribe')); return; } setErr(''); setStep(1); }}
            className="mt-6 w-full rounded-full bg-orange-600 py-3 text-sm font-extrabold text-white transition hover:bg-orange-500"
          >
            {t('stepWhen')} →
          </button>
        </section>
      )}

      {/* STEP 2 — date/time */}
      {step === 1 && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-extrabold text-stone-900">{t('dateLabel')}</label>
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border-2 border-stone-200 p-3 text-sm font-semibold outline-none focus:border-orange-500"
          />
          <p className="mb-2 mt-5 text-sm font-extrabold text-stone-900">{t('timeLabel')}</p>
          <div className="flex flex-wrap gap-2">
            {SLOTS.map((s) => (
              <button
                key={s}
                onClick={() => setTime(s)}
                className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                  time === s ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="mt-6 flex gap-2">
            <button onClick={() => setStep(0)} className="rounded-full bg-stone-200 px-6 py-3 text-sm font-bold text-stone-700">
              ← {t('back')}
            </button>
            <button
              onClick={() => { if (!date || !time) { setErr(t('needDateTime')); return; } setErr(''); setStep(2); }}
              className="flex-1 rounded-full bg-orange-600 py-3 text-sm font-extrabold text-white transition hover:bg-orange-500"
            >
              {t('stepConfirm')} →
            </button>
          </div>
        </section>
      )}

      {/* STEP 3 — confirm */}
      {step === 2 && (
        <section className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-extrabold text-stone-900">{t('stepConfirm')}</h2>
          <dl className="mt-4 space-y-3 rounded-2xl bg-stone-100 p-4 text-sm">
            <div className="flex justify-between gap-4"><dt className="font-bold text-stone-500">{t('workerName')}</dt><dd className="font-extrabold text-stone-900">{worker.name}</dd></div>
            <div className="flex justify-between gap-4"><dt className="font-bold text-stone-500">{t('jobDesc')}</dt><dd className="text-right font-semibold text-stone-800">{job}</dd></div>
            <div className="flex justify-between gap-4"><dt className="font-bold text-stone-500">{t('dateLabel')}</dt><dd className="font-semibold text-stone-800">{date} · {time}</dd></div>
            <div className="flex justify-between gap-4 border-t border-stone-200 pt-3"><dt className="font-bold text-stone-500">{t('estCost')}</dt><dd className="text-lg font-black text-orange-700">PKR {worker.rate.toLocaleString()}{t('perDay')}</dd></div>
          </dl>
          <p className="mt-3 rounded-xl bg-green-50 px-4 py-2 text-xs font-semibold text-green-800">{t('paymentNote')}</p>
          <div className="mt-6 flex gap-2">
            <button onClick={() => setStep(1)} className="rounded-full bg-stone-200 px-6 py-3 text-sm font-bold text-stone-700">
              ← {t('back')}
            </button>
            <button onClick={confirm} className="flex-1 rounded-full bg-green-600 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-green-500">
              ✓ {t('confirmBooking')}
            </button>
          </div>
        </section>
      )}

      {/* STEP 4 — tracker */}
      {step === 3 && booking && (
        <section className="space-y-4">
          <div className="rounded-3xl bg-green-600 p-6 text-center text-white shadow-xl">
            <p className="text-2xl">✅</p>
            <h2 className="mt-1 text-xl font-black">{t('bookingConfirmed')}</h2>
            <p className="mt-1 text-sm font-semibold text-green-100">{t('bookingRef')}: <b>{booking.ref}</b></p>
            <div className="mt-2"><SimBadge /></div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <ol className="space-y-0">
              {stages.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-black ${
                        i < booking.stage ? 'bg-green-600 text-white' : i === booking.stage ? 'bg-orange-600 text-white' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {i < booking.stage ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    {i < stages.length - 1 && <span className={`h-8 w-1 ${i < booking.stage ? 'bg-green-600' : 'bg-stone-200'}`} />}
                  </div>
                  <p className={`pb-6 pt-1.5 font-extrabold ${i <= booking.stage ? 'text-stone-900' : 'text-stone-400'}`}>{s}</p>
                </li>
              ))}
            </ol>

            {booking.stage < 3 && (
              <button onClick={advance} className="w-full rounded-full bg-stone-900 py-3 text-sm font-extrabold text-white transition hover:bg-stone-700">
                {t('simulateProgress')} →
              </button>
            )}

            {booking.stage === 3 && !rated && (
              <div className="rounded-2xl bg-stone-100 p-4 text-center">
                <p className="text-sm font-extrabold text-stone-900">{t('ratePrompt')}</p>
                <div className="mt-2 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} onClick={() => submitRating(r)} aria-label={`rate ${r}`} className="p-1 text-3xl transition hover:scale-110">
                      <span className={r <= rating ? 'text-amber-500' : 'text-stone-300'}>★</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {rated && <p className="rounded-2xl bg-green-50 p-4 text-center text-sm font-bold text-green-800">🎉 {t('rateSaved')}</p>}

            <button
              onClick={() => { setComplaintOpen(true); setComplaintDone(false); }}
              className="mt-4 w-full rounded-full border-2 border-red-200 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              ⚠ {t('complaintBtn')}
            </button>
          </div>
        </section>
      )}

      {/* complaint modal */}
      {complaintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-extrabold text-stone-900">{t('complaintTitle')}</h3>
            {!complaintDone ? (
              <>
                <textarea
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder={t('complaintPlaceholder')}
                  rows={4}
                  className="mt-3 w-full rounded-2xl border-2 border-stone-200 p-3 text-sm outline-none focus:border-orange-500"
                />
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setComplaintOpen(false)} className="flex-1 rounded-full bg-stone-200 py-2.5 text-sm font-bold text-stone-700">{t('cancel')}</button>
                  <button onClick={sendComplaint} className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-extrabold text-white">{t('send')}</button>
                </div>
              </>
            ) : (
              <>
                {/* mock WhatsApp-style confirmation card */}
                <div className="wa-bg mt-3 rounded-2xl p-4">
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[#d9fdd3] p-3 shadow">
                    <p className="flex items-center gap-2 text-sm font-semibold text-stone-800">
                      <WhatsAppGlyph className="h-5 w-5 text-green-700" />
                      {t('complaintSent')}
                    </p>
                    <p className="mt-1 text-right text-[10px] text-stone-500">Message sent (simulated) ✓✓</p>
                  </div>
                </div>
                <button onClick={() => setComplaintOpen(false)} className="mt-4 w-full rounded-full bg-stone-900 py-2.5 text-sm font-bold text-white">OK</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense>
      <BookInner />
    </Suspense>
  );
}
