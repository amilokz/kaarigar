'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AREAS, CATEGORIES, useLang } from '@/lib/i18n';
import { getDisabledAreas, getDisabledCats, getWorkers } from '@/lib/workers';
import WorkerCard from '@/components/WorkerCard';

const RATE_STEPS = [0, 2000, 2500, 3000, 3500, 4000, 5000];

function ListingInner() {
  const { t, catName } = useLang();
  const params = useSearchParams();

  const [cat, setCat] = useState(params.get('cat') ?? 'all');
  const [area, setArea] = useState(params.get('area') ?? 'all');
  const [maxRate, setMaxRate] = useState(RATE_STEPS.length - 1);
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const workers = useMemo(() => getWorkers(), []);
  const disabledCats = useMemo(() => getDisabledCats(), []);
  const disabledAreas = useMemo(() => getDisabledAreas(), []);

  const filtered = workers.filter((w) => {
    if (cat !== 'all' && w.category !== cat) return false;
    if (area !== 'all' && w.area !== area) return false;
    if (w.rate > RATE_STEPS[maxRate]) return false;
    if (w.rating < minRating) return false;
    if (verifiedOnly && !w.verified) return false;
    if (w.status === 'rejected') return false;
    if (w.status === 'pending') return false; // needs admin approval
    if (disabledCats.includes(w.category)) return false;
    if (disabledAreas.includes(w.area)) return false;
    return true;
  });

  const clear = () => {
    setCat('all'); setArea('all'); setMaxRate(RATE_STEPS.length - 1);
    setMinRating(0); setVerifiedOnly(false);
  };

  const selectCls = 'field';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black tracking-tight text-stone-900">{t('findWorkers')}</h1>

      {/* FILTERS */}
      <section className="card p-5 sm:p-6" aria-label="filters">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="field-label">
              {t('filterCategory')}
            </span>
            <select value={cat} onChange={(e) => setCat(e.target.value)} className={selectCls}>
              <option value="all">{t('anyCategory')}</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{catName(c.id)}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="field-label">
              {t('filterArea')}
            </span>
            <select value={area} onChange={(e) => setArea(e.target.value)} className={selectCls}>
              <option value="all">{t('allAreas')}</option>
              {AREAS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>
          <div>
            <span className="field-label">
              {t('filterRate')}: {maxRate === RATE_STEPS.length - 1 ? '—' : `≤ PKR ${RATE_STEPS[maxRate].toLocaleString()}`}
            </span>
            <input
              type="range"
              min={0}
              max={RATE_STEPS.length - 1}
              value={maxRate}
              onChange={(e) => setMaxRate(Number(e.target.value))}
              className="w-full accent-orange-600"
              aria-label={t('filterRate')}
            />
          </div>
          <div>
            <span className="field-label">
              {t('filterRating')}: {minRating === 0 ? t('anyRating') : `${minRating}+ ★`}
            </span>
            <div className="flex gap-1.5">
              {[0, 4, 4.5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                    minRating === r ? 'bg-gradient-to-b from-orange-500 to-orange-700 text-white shadow-[0_6px_14px_-6px_rgba(234,88,12,0.7)]' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {r === 0 ? t('anyRating') : `${r}+ ★`}
                </button>
              ))}
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-stone-100 px-4 py-2.5">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="h-5 w-5 accent-orange-600"
            />
            <span className="text-sm font-bold text-stone-800">{t('filterVerified')}</span>
          </label>
          <div className="flex items-end">
            <button onClick={clear} className="text-sm font-bold text-orange-700 underline underline-offset-2 hover:text-orange-600">
              {t('clearFilters')}
            </button>
          </div>
        </div>
      </section>

      <p className="text-sm font-semibold text-stone-500" role="status">
        {filtered.length} {t('results')}
      </p>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-stone-500">
          <p className="text-lg font-bold">{t('noResults')}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((w) => (
            <WorkerCard key={w.id} worker={w} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense>
      <ListingInner />
    </Suspense>
  );
}
