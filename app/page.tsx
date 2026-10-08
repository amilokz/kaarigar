'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import {
  Bolt, Cash, Check, Chevron, Pin, Route, Shield, Star, WhatsAppGlyph,
} from '@/components/icons';
import WorkerCard, { Avatar, Stars } from '@/components/WorkerCard';
import { getWorkers } from '@/lib/workers';

const FAQS = ['faq1', 'faq2', 'faq3', 'faq4', 'faq5'] as const;

function HomeInner() {
  const { t, catName } = useLang();
  const featured = getWorkers().filter((w) => w.verified && w.availableToday).slice(0, 3);

  const features = [
    { icon: Shield, title: t('ft1t'), desc: t('ft1d') },
    { icon: Bolt, title: t('ft2t'), desc: t('ft2d') },
    { icon: Route, title: t('ft3t'), desc: t('ft3d') },
    { icon: WhatsAppGlyph, title: t('ft4t'), desc: t('ft4d') },
    { icon: Star, title: t('ft5t'), desc: t('ft5d') },
    { icon: Cash, title: t('ft6t'), desc: t('ft6d') },
  ];

  const steps = [
    { n: '1', title: t('hw1t'), desc: t('hw1d') },
    { n: '2', title: t('hw2t'), desc: t('hw2d') },
    { n: '3', title: t('hw3t'), desc: t('hw3d') },
  ];

  const testimonials = [
    { q: t('tst1q'), n: t('tst1n'), r: t('tst1r') },
    { q: t('tst2q'), n: t('tst2n'), r: t('tst2r') },
    { q: t('tst3q'), n: t('tst3n'), r: t('tst3r') },
  ];

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* ============ HERO ============ */}
      <section className="hero-mesh fade-up overflow-hidden rounded-[2rem] text-white shadow-[0_30px_60px_-24px_rgba(154,52,18,0.55)] ring-1 ring-orange-500/20">
        <div aria-hidden="true" className="hero-ring float-slow right-[-3rem] top-[-3rem] hidden h-56 w-56 sm:block" />
        <div aria-hidden="true" className="hero-ring right-[-1rem] top-[-1rem] hidden h-32 w-32 sm:block" />
        <div className="relative grid items-center gap-10 px-6 py-12 sm:px-12 sm:py-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">{t('landingEyebrow')}</p>
            <h1 className="mt-5 max-w-xl text-4xl font-black leading-[1.2] tracking-tight sm:text-5xl sm:leading-[1.15]">
              {t('landingH1')}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">
              {t('landingSub')}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/workers" className="btn-brand px-8 py-4 text-base">
                🔨 {t('navBook')}
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/[0.08] px-8 py-4 text-base font-extrabold text-orange-200 ring-2 ring-orange-500/50 backdrop-blur transition hover:bg-white/[0.14] hover:ring-orange-400 active:scale-[0.98]"
              >
                {t('heroCtaHow')}
              </Link>
            </div>
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-stone-400">
              {t('heroStats').split('·').map((s, i, arr) => (
                <span key={i} className="flex items-center gap-3">
                  <span>{s.trim()}</span>
                  {i < arr.length - 1 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-orange-500" />}
                </span>
              ))}
            </p>
          </div>

          {/* CSS-only hero visual: sample booking card + floating accents */}
          <div aria-label={t('landingH1')} className="relative mx-auto w-full max-w-sm lg:mx-0 lg:justify-self-end">
            <div className="worker-card p-5 text-left sm:p-6">
              <div className="flex items-start gap-4">
                <span className="relative">
                  <Avatar name={t('heroWorkerName')} size="h-16 w-16 text-xl" />
                  <span className="pulse-dot absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-600" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="truncate text-lg font-extrabold text-stone-900">{t('heroWorkerName')}</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
                      <Shield className="h-3 w-3" />
                      {t('verified')}
                    </span>
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-orange-700">{catName('electrician')}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
                    <Pin className="h-3 w-3" /> {t('heroWorkerArea')}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-stone-100 pt-4 text-sm">
                <span className="text-lg font-black text-stone-900">
                  PKR 2,500
                  <span className="text-xs font-semibold text-stone-500">{t('perDay')}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 text-stone-700">
                  <Stars rating={4.9} className="h-3.5 w-3.5" />
                  <b>4.9</b>
                </span>
                <span className="text-xs font-medium text-stone-500">132 {t('jobsDone')}</span>
              </div>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-extrabold text-green-700">
                <span className="pulse-dot h-2 w-2 rounded-full bg-green-600" aria-hidden="true" />
                {t('availableToday')}
              </p>
            </div>

            {/* floating accent cards */}
            <div className="float-slow absolute -right-2 -top-6 flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_14px_30px_-10px_rgba(22,163,74,0.7)] ring-1 ring-white/30 sm:-right-5">
              <Check className="h-4 w-4" />
              {t('floatBooked')}
            </div>
            <div
              className="float-slow absolute -bottom-7 -left-2 flex items-center gap-2 rounded-2xl bg-stone-900 px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_14px_30px_-10px_rgba(0,0,0,0.6)] ring-1 ring-white/15 sm:-left-5"
              style={{ animationDelay: '1.6s' }}
            >
              <Star className="h-4 w-4 text-amber-400" />
              {t('floatDone')}
            </div>
          </div>
        </div>
      </section>

      {/* ============ TRUST STRIP ============ */}
      <section aria-label="trust" className="fade-up fade-up-1 -mt-8 sm:-mt-10">
        <ul className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4">
          {[t('trust1'), t('trust2'), t('trust3'), t('trust4')].map((x) => (
            <li
              key={x}
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-stone-600 shadow-sm"
            >
              <Check className="h-3.5 w-3.5 text-green-600" />
              {x}
            </li>
          ))}
        </ul>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="fade-up fade-up-2 scroll-mt-36">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">{t('featuresTitle')}</h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">{t('featuresSub')}</p>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card card-lift p-6 sm:p-7">
              <span className="flex h-16 w-16 items-center justify-center rounded-[1.3rem] bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] ring-1 ring-orange-200/60">
                <f.icon className="h-8 w-8" />
              </span>
              <h3 className="mt-4 text-base font-extrabold text-stone-900">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="card fade-up scroll-mt-36 p-6 sm:p-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">{t('howItWorks')}</h2>
        </div>
        <ol className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-3xl border border-stone-100 bg-gradient-to-b from-stone-50 to-white p-6 shadow-sm transition hover:shadow-md">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 text-xl font-black text-white shadow-[0_8px_16px_-6px_rgba(234,88,12,0.7)]">
                {s.n}
              </span>
              <h3 className="mt-4 text-base font-extrabold text-stone-900">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-stone-600">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ============ LIVE DEMO CTA BAND ============ */}
      <section className="fade-up overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 p-8 text-center text-white shadow-[0_24px_50px_-20px_rgba(234,88,12,0.7)] ring-1 ring-orange-400/40 sm:p-12">
        <h2 className="mx-auto max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">{t('ctaBandT')}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-orange-100 sm:text-base">{t('ctaBandD')}</p>
        <Link
          href="/workers"
          className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-white px-9 py-4 text-base font-extrabold text-orange-700 shadow-[0_12px_28px_-10px_rgba(0,0,0,0.4)] transition hover:bg-orange-50 active:scale-[0.98]"
        >
          {t('ctaBandB')} →
        </Link>
      </section>

      {/* ============ WORKERS PREVIEW ============ */}
      <section id="workers" className="fade-up scroll-mt-36">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">{t('workersPrevT')}</h2>
          <p className="mt-2 text-sm text-stone-600 sm:text-base">{t('workersPrevD')}</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {featured.map((w) => (
            <WorkerCard key={w.id} worker={w} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/workers"
            className="btn-dark inline-flex px-8 py-3.5 text-sm"
          >
            {t('workersViewAll')} →
          </Link>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="fade-up">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">{t('testiT')}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((x) => (
            <figure key={x.n} className="card flex flex-col p-6 sm:p-7">
              <span className="mb-3 inline-flex w-fit items-center gap-1 rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-stone-500">
                {t('sampleTag')}
              </span>
              <Stars rating={5} className="h-4 w-4" />
              <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-stone-700">“{x.q}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-stone-100 pt-4">
                <Avatar name={x.n} size="h-11 w-11 text-sm" />
                <div>
                  <p className="text-sm font-extrabold text-stone-900">{x.n}</p>
                  <p className="text-xs font-medium text-stone-500">{x.r}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="fade-up mx-auto w-full max-w-3xl scroll-mt-36">
        <h2 className="text-center text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">{t('faqT')}</h2>
        <div className="mt-6 space-y-3">
          {FAQS.map((k) => (
            <details key={k} className="group card overflow-hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left text-base font-extrabold text-stone-900 transition hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 sm:px-6 [&::-webkit-details-marker]:hidden">
                {t(`${k}q`)}
                <Chevron className="h-5 w-5 shrink-0 text-orange-600 transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-stone-600 sm:px-6">{t(`${k}a`)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="hero-mesh fade-up overflow-hidden rounded-[2rem] p-8 text-center text-white shadow-[0_30px_60px_-24px_rgba(154,52,18,0.55)] ring-1 ring-orange-500/20 sm:p-14">
        <h2 className="mx-auto max-w-2xl text-2xl font-black tracking-tight sm:text-4xl">{t('finalT')}</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-stone-300 sm:text-base">{t('finalD')}</p>
        <Link href="/workers" className="btn-brand mt-8 px-10 py-4 text-base">
          🔨 {t('finalB')}
        </Link>
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
