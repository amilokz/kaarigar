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
    <div className="space-y-12">
      {/* HERO — one-line problem + immediate action */}
      <section className="hero-mesh fade-up overflow-hidden rounded-[2rem] text-white shadow-[0_30px_60px_-24px_rgba(154,52,18,0.55)] ring-1 ring-orange-500/20">
        <div aria-hidden="true" className="hero-ring float-slow right-[-3rem] top-[-3rem] hidden h-56 w-56 sm:block" />
        <div aria-hidden="true" className="hero-ring right-[-1rem] top-[-1rem] hidden h-32 w-32 sm:block" />
        <div className="relative px-6 py-12 sm:px-12 sm:py-16">
          <p className="eyebrow">{t('heroEyebrow')}</p>
          <h1 className="relative mt-5 max-w-2xl text-3xl font-black leading-[1.25] tracking-tight sm:text-[2.75rem] sm:leading-[1.2]">
            {t('heroProblem')}
          </h1>
          <p className="relative mt-4 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">
            {t('heroSub')}
          </p>

          <form
            className="relative mt-8 flex max-w-xl flex-col gap-2.5 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/workers${area ? `?area=${encodeURIComponent(area)}` : ''}`);
            }}
          >
            <label className="relative flex-1">
              <Pin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
              <input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                list="kaarigar-areas"
                placeholder={t('searchPlaceholder')}
                className="field !rounded-full !border-0 py-3.5 pl-11 pr-4 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.5)]"
              />
              <datalist id="kaarigar-areas">
                {AREAS.map((a) => (
                  <option key={a} value={a} />
                ))}
              </datalist>
            </label>
            <button type="submit" className="btn-brand px-9 py-3.5 text-base">
              {t('searchBtn')}
            </button>
          </form>

          <a
            href="/workers"
            className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-7 py-3.5 text-base font-extrabold text-orange-200 ring-2 ring-orange-500/50 backdrop-blur transition hover:bg-white/[0.14] hover:ring-orange-400 active:scale-[0.98]"
          >
            🔨 {t('heroCta')}
          </a>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="fade-up fade-up-1">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl font-black tracking-tight text-stone-900">{t('chooseTrade')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`/workers?cat=${c.id}`}
              className="group flex flex-col items-center gap-3.5 rounded-3xl border border-stone-200/90 bg-white p-6 text-center shadow-[0_2px_6px_rgba(28,25,23,0.05),0_14px_30px_-18px_rgba(28,25,23,0.25)] transition-all duration-200 hover:-translate-y-1.5 hover:border-orange-500 hover:shadow-[0_20px_40px_-16px_rgba(234,88,12,0.35)]"
            >
              <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.4rem] bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-orange-200/60 transition-all duration-200 group-hover:from-orange-500 group-hover:to-orange-700 group-hover:text-white group-hover:shadow-[0_10px_20px_-6px_rgba(234,88,12,0.6)]">
                <CategoryIcon id={c.id} className="h-10 w-10" />
              </span>
              <span className="text-sm font-extrabold text-stone-800">{catName(c.id)}</span>
            </a>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="card fade-up fade-up-2 p-6 sm:p-9">
        <h2 className="text-2xl font-black tracking-tight text-stone-900">{t('howItWorks')}</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { n: '1', title: t('step1t'), desc: t('step1d') },
            { n: '2', title: t('step2t'), desc: t('step2d') },
            { n: '3', title: t('step3t'), desc: t('step3d') },
          ].map((s) => (
            <li key={s.n} className="rounded-3xl border border-stone-100 bg-gradient-to-b from-stone-50 to-white p-6 shadow-sm transition hover:shadow-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-lg font-black text-white shadow-[0_8px_16px_-6px_rgba(234,88,12,0.7)]">
                {s.n}
              </span>
              <h3 className="mt-4 text-base font-extrabold text-stone-900">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* STATS + FEATURED */}
      <section className="fade-up fade-up-3 grid gap-5 lg:grid-cols-3">
        <div className="card-dark flex items-center justify-around p-7 text-center text-white lg:col-span-1">
          {[
            { v: '30+', l: t('statWorkers') },
            { v: '10', l: t('statAreas') },
            { v: '4.6★', l: t('statJobs') },
          ].map((s) => (
            <div key={s.l}>
              <p className="bg-gradient-to-br from-amber-300 to-orange-500 bg-clip-text text-3xl font-black text-transparent">
                {s.v}
              </p>
              <p className="mt-1.5 text-xs font-semibold text-stone-400">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4 lg:col-span-2">
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
