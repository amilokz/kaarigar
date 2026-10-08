'use client';

import { useMemo, useState } from 'react';
import { AREAS, CATEGORIES, useLang } from '@/lib/i18n';
import { load, remove, save } from '@/lib/store';
import {
  getBookings, getComplaints, getWorker, getWorkers,
  toggleDisabled, updateBooking, updateComplaint, updateWorker,
  type Booking,
} from '@/lib/workers';
import seedBookings from '@/data/bookings.json';
import { Avatar, SimBadge } from '@/components/WorkerCard';
import ResetButton from '@/components/ResetButton';
import { CategoryIcon } from '@/components/icons';

type Tab = 'verify' | 'bookings' | 'complaints' | 'cats' | 'commission' | 'payments';

const STAGE_KEYS = ['stageBooked', 'stageOnWay', 'stageDone', 'stageRate'];

export default function AdminPage() {
  const { t, catName } = useLang();
  const [loggedIn, setLoggedIn] = useState(() => {
    try { return localStorage.getItem('kaarigar-admin') === '1'; } catch { return false; }
  });
  const [tab, setTab] = useState<Tab>('verify');
  const [tick, setTick] = useState(0);
  const [commRate, setCommRate] = useState(() => load<number>('commission-rate', 5));
  const [regFee, setRegFee] = useState(() => load<number>('reg-fee', 200));
  const [savedMsg, setSavedMsg] = useState(false);
  const refresh = () => setTick((x) => x + 1);

  const data = useMemo(() => {
    void tick;
    const workers = getWorkers();
    const local = getBookings();
    const seeds = (seedBookings as Booking[]).filter((s) => !local.some((l) => l.ref === s.ref));
    return {
      pending: workers.filter((w) => w.status === 'pending'),
      bookings: [...local, ...seeds],
      seedRefs: new Set((seedBookings as Booking[]).map((s) => s.ref)),
      complaints: getComplaints(),
      disabledCats: load<string[]>('disabled-cats', []),
      disabledAreas: load<string[]>('disabled-areas', []),
    };
  }, [tick]);

  const login = () => {
    try { localStorage.setItem('kaarigar-admin', '1'); } catch { /* ignore */ }
    setLoggedIn(true);
  };
  const logout = () => {
    remove('admin');
    setLoggedIn(false);
  };

  const saveSettings = () => {
    save('commission-rate', commRate);
    save('reg-fee', regFee);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'verify', label: t('tabVerify') },
    { id: 'bookings', label: t('tabBookings') },
    { id: 'complaints', label: t('tabComplaints') },
    { id: 'cats', label: t('tabCats') },
    { id: 'commission', label: t('tabCommission') },
    { id: 'payments', label: t('tabPayments') },
  ];

  if (!loggedIn) {
    return (
      <div className="mx-auto max-w-md pt-10">
        <div className="card p-8 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-stone-800 to-stone-950 text-3xl shadow-lg ring-1 ring-white/10">🔐</span>
          <h1 className="mt-4 text-xl font-black text-stone-900">{t('adminLoginTitle')}</h1>
          <p className="mt-1 text-sm text-stone-500">{t('adminLoginSub')}</p>
          <button onClick={login} className="btn-brand mt-6 w-full py-3.5 text-sm">
            {t('loginDemo')}
          </button>
          <div className="mt-3"><SimBadge /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tight text-stone-900">⚙️ {t('adminTitle')}</h1>
        <div className="flex gap-2">
          <ResetButton />
          <button onClick={logout} className="rounded-full bg-stone-200 px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-300">
            {t('logout')}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-extrabold transition ${
              tab === tb.id ? 'bg-gradient-to-b from-stone-700 to-stone-950 text-white shadow-[0_8px_18px_-8px_rgba(0,0,0,0.7)]' : 'bg-white text-stone-600 shadow-sm hover:bg-stone-100'
            }`}
          >
            {tb.label}
            {tb.id === 'verify' && data.pending.length > 0 && (
              <span className="ml-1.5 rounded-full bg-orange-600 px-2 py-0.5 text-xs text-white">{data.pending.length}</span>
            )}
            {tb.id === 'complaints' && data.complaints.filter((c) => !c.resolved).length > 0 && (
              <span className="ml-1.5 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                {data.complaints.filter((c) => !c.resolved).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* VERIFICATION QUEUE */}
      {tab === 'verify' && (
        <section className="space-y-3">
          {data.pending.length === 0 && (
            <p className="card p-8 text-center font-semibold text-stone-500">{t('noPending')}</p>
          )}
          {data.pending.map((w) => (
            <div key={w.id} className="card flex flex-wrap items-center gap-4 p-4 sm:p-5">
              <Avatar name={w.name} size="h-12 w-12 text-base" />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-stone-900">{w.name}</p>
                <p className="text-xs text-stone-500">
                  {catName(w.category)} · {w.area} · PKR {w.rate.toLocaleString()}{t('perDay')} · {w.phone} · via {w.source}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { updateWorker(w.id, { status: 'approved' }); refresh(); }}
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
                >
                  ✓ {t('approve')}
                </button>
                <button
                  onClick={() => { updateWorker(w.id, { status: 'rejected' }); refresh(); }}
                  className="rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-200"
                >
                  ✗ {t('reject')}
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* BOOKINGS */}
      {tab === 'bookings' && (
        <section className="space-y-3">
          {data.bookings.length === 0 && (
            <p className="card p-8 text-center font-semibold text-stone-500">{t('noBookings')}</p>
          )}
          {data.bookings.map((b) => (
            <div key={b.ref} className="card p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-extrabold text-stone-900">{b.ref} — {b.workerName}</p>
                  <p className="text-xs text-stone-500">{b.job} · {b.date} {b.time} · {b.area}</p>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-extrabold text-orange-800">
                  {t(STAGE_KEYS[Math.min(b.stage, 3)])}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {STAGE_KEYS.map((_, i) => (
                  <span key={i} className={`h-2 flex-1 rounded-full ${i <= b.stage ? 'bg-orange-600' : 'bg-stone-200'}`} />
                ))}
              </div>
              {!data.seedRefs.has(b.ref) && b.stage < 3 && (
                <button
                  onClick={() => { updateBooking(b.ref, { stage: b.stage + 1 }); refresh(); }}
                  className="mt-3 rounded-full bg-stone-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-stone-700"
                >
                  {t('simulateProgress')}
                </button>
              )}
            </div>
          ))}
        </section>
      )}

      {/* COMPLAINTS */}
      {tab === 'complaints' && (
        <section className="space-y-3">
          {data.complaints.length === 0 && (
            <p className="card p-8 text-center font-semibold text-stone-500">{t('noComplaints')}</p>
          )}
          {data.complaints.map((c) => (
            <div key={c.id} className={`rounded-3xl p-4 shadow-sm ${c.resolved ? 'bg-stone-100' : 'bg-white ring-2 ring-red-200'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-extrabold text-stone-900">{c.name} {c.ref && <span className="text-xs font-bold text-stone-500">· {c.ref}</span>}</p>
                {c.resolved ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800">✓ {t('resolved')}</span>
                ) : (
                  <button
                    onClick={() => { updateComplaint(c.id, { resolved: true }); refresh(); }}
                    className="rounded-full bg-green-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-green-500"
                  >
                    {t('markResolved')}
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-stone-600">{c.text}</p>
              <p className="mt-1 text-xs text-stone-400">{new Date(c.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </section>
      )}

      {/* CATEGORIES / AREAS */}
      {tab === 'cats' && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="font-extrabold text-stone-900">{t('filterCategory')}</h2>
            <div className="mt-3 space-y-2">
              {CATEGORIES.map((c) => {
                const off = data.disabledCats.includes(c.id);
                return (
                  <div key={c.id} className="flex items-center justify-between rounded-xl bg-stone-100 px-4 py-2.5">
                    <span className="flex items-center gap-2 text-sm font-bold text-stone-800">
                      <CategoryIcon id={c.id} className="h-6 w-6 text-orange-700" /> {catName(c.id)}
                    </span>
                    <button
                      onClick={() => { toggleDisabled('cats', c.id); refresh(); }}
                      className={`rounded-full px-3 py-1 text-xs font-extrabold ${off ? 'bg-stone-300 text-stone-600' : 'bg-green-600 text-white'}`}
                    >
                      {off ? t('disable') : t('enable')}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
          <section className="rounded-3xl bg-white p-5 shadow-sm">
            <h2 className="font-extrabold text-stone-900">{t('filterArea')}</h2>
            <div className="mt-3 space-y-2">
              {AREAS.map((a) => {
                const off = data.disabledAreas.includes(a);
                return (
                  <div key={a} className="flex items-center justify-between rounded-xl bg-stone-100 px-4 py-2.5">
                    <span className="text-sm font-bold text-stone-800">{a}</span>
                    <button
                      onClick={() => { toggleDisabled('areas', a); refresh(); }}
                      className={`rounded-full px-3 py-1 text-xs font-extrabold ${off ? 'bg-stone-300 text-stone-600' : 'bg-green-600 text-white'}`}
                    >
                      {off ? t('disable') : t('enable')}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}

      {/* COMMISSION */}
      {tab === 'commission' && (
        <section className="card mx-auto max-w-md p-6">
          <h2 className="font-extrabold text-stone-900">{t('tabCommission')}</h2>
          <label className="mt-4 block">
            <span className="field-label">{t('commissionRate')}</span>
            <input
              type="number" min={0} max={50} value={commRate}
              onChange={(e) => setCommRate(Number(e.target.value))}
              className="field"
            />
          </label>
          <label className="mt-4 block">
            <span className="field-label">{t('regFee')}</span>
            <input
              type="number" min={0} value={regFee}
              onChange={(e) => setRegFee(Number(e.target.value))}
              className="field"
            />
          </label>
          <button onClick={saveSettings} className="btn-brand mt-5 w-full py-3.5 text-sm">
            {t('saveSettings')}
          </button>
          {savedMsg && <p className="mt-2 text-center text-sm font-bold text-green-700">✓ {t('saved')}</p>}
          <div className="mt-3"><SimBadge /></div>
        </section>
      )}

      {/* PAYMENTS */}
      {tab === 'payments' && (
        <section className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-xs uppercase tracking-wide text-stone-500">
                <th className="px-4 py-3">{t('bookingRef')}</th>
                <th className="px-4 py-3">{t('workerName')}</th>
                <th className="px-4 py-3">{t('payMethod')}</th>
                <th className="px-4 py-3">{t('payAmount')}</th>
                <th className="px-4 py-3">{t('payStatus')}</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.map((b) => {
                const w = getWorker(b.workerId);
                const amt = w ? w.rate : 0;
                return (
                  <tr key={b.ref} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 font-extrabold">{b.ref}</td>
                    <td className="px-4 py-3">{b.workerName}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        b.paymentMethod === 'Cash' ? 'bg-stone-200 text-stone-700'
                        : b.paymentMethod === 'Easypaisa' ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-700'
                      }`}>{b.paymentMethod ?? 'Cash'}</span>
                    </td>
                    <td className="px-4 py-3 font-extrabold">PKR {amt.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {b.paid
                        ? <span className="font-bold text-green-700">✓ {t('paid')}</span>
                        : data.seedRefs.has(b.ref)
                          ? <span className="text-xs font-bold text-stone-500">{t('cashOnDone')}</span>
                          : <button
                              onClick={() => { updateBooking(b.ref, { paid: true }); refresh(); }}
                              className="rounded-full bg-stone-900 px-3 py-1 text-xs font-bold text-white hover:bg-stone-700"
                            >
                              {t('cashOnDone')}
                            </button>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="px-4 py-3 text-xs text-stone-400">Cash / Easypaisa / JazzCash — {t('aiSimulated')}.</p>
        </section>
      )}
    </div>
  );
}
