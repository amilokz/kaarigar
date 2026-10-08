'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AREAS, CATEGORIES, useLang } from '@/lib/i18n';
import { CategoryIcon, Pin } from '@/components/icons';
import WorkerCard from '@/components/WorkerCard';
import { getWorkers } from '@/lib/workers';

function HomeInner() {
  const { t, catName } = useLang();
  const router = useRouter();
  const [area, setArea] = useState('');
  const featured = getWorkers().filter((w) => w.verified).slice(0, 3);

  return (
    <div className="space-y-10">
      {/* HERO — one-line problem + immediate action */}
      <section className="overflow-hidden rounded-3xl bg-stone-900 text-white shadow-xl">
        <div className="relative px-6 py-10 sm:px-10 sm:py-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-orange-600/30 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl"
          />
          <p className="relative max-w-2xl text-xl font-bold leading-snug sm:text-2xl">
            {t('heroProblem')}
          </p>
          <p className="relative mt-3 max-w-xl text-sm text-stone-300">{t('heroSub')}</p>

          <form
            className="relative mt-6 flex max-w-xl flex-col gap-2 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/workers${area ? `?area=${encodeURIComponent(area)}` : ''}`);
            }}
          >
            <label className="relative flex-1">
              <Pin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                list="kaarigar-areas"
                placeholder={t('searchPlaceholder')}
                className="w-full rounded-full border-2 border-transparent bg-white py-3 pl-10 pr-4 text-sm font-semibold text-stone-900 outline-none focus:border-orange-500"
              />
              <datalist id="kaarigar-areas">
                {AREAS.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </label>
            <button
              type="submit"
              className="rounded-full bg-orange-600 px-8 py-3 text-sm font-extrabold text-white shadow-lg transition hover:bg-orange-500"
            >
              {t('searchBtn')}
            </button>
          </form>

          <a
            href="/workers"
            className="relative mt-4 inline-block rounded-full bg-white/10 px-6 py-3 text-base font-extrabold text-orange-300 ring-2 ring-orange-500/60 transition hover:bg-white/20"
          >
            🔨 {t('heroCta')}
          </a>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section>
        <h2 className="mb-4 text-xl font-extrabold text-stone-900">{t('chooseTrade')}</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`/workers?cat=${c.id}`}
              className="card-lift group flex flex-col items-center gap-3 rounded-2xl border-2 border-stone-200 bg-white p-5 text-center shadow-sm transition hover:border-orange-500"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700 transition group-hover:bg-orange-600 group-hover:text-white">
                <CategoryIcon id={c.id} className="h-9 w-9" />
              </span>
              <span className="text-sm font-extrabold text-stone-800">{catName(c.id)}</span>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <h2 className="mb-5 text-xl font-extrabold text-stone-900">{t('howItWorks')}</h2>
        <ol className="grid gap-4 sm:grid-cols-3">
          {[
            { n: '1', title: t('step1t'), desc: t('step1d') },
            { n: '2', title: t('step2t'), desc: t('step2d') },
            { n: '3', title: t('step3t'), desc: t('step3d') },
          ].map((s) => (
            <li key={s.n} className="rounded-2xl bg-stone-100 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-lg font-black text-white">
                {s.n}
              </span>
              <h3 className="mt-3 font-extrabold text-stone-900">{s.title}</h3>
              <p className="mt-1 text-sm text-stone-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* STATS + FEATURED */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="flex items-center justify-around rounded-3xl bg-stone-900 p-6 text-center text-white lg:col-span-1">
          {[
            { v: '30+', l: t('statWorkers') },
            { v: '10', l: t('statAreas') },
            { v: '4.6★', l: t('statJobs') },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-2xl font-black text-orange-400">{s.v}</p>
              <p className="mt-1 text-xs text-stone-400">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="space-y-3 lg:col-span-2">
          {featured.map((w) => (
            <WorkerCard key={w.id} worker={w} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
