'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLang } from '@/lib/i18n';
import { getWorker } from '@/lib/workers';
import { Avatar, Stars } from '@/components/WorkerCard';
import { SimBadge } from '@/components/WorkerCard';
import { CategoryIcon, Check, Clock, Phone, Pin, Shield } from '@/components/icons';

function ProfileInner() {
  const { t, catName } = useLang();
  const params = useSearchParams();
  const worker = getWorker(params.get('id') ?? '');

  if (!worker) {
    return (
      <div className="card p-10 text-center">
        <p className="text-lg font-bold text-stone-600">{t('noResults')}</p>
        <Link href="/workers" className="mt-4 inline-block font-bold text-orange-700 underline">
          ← {t('back')}
        </Link>
      </div>
    );
  }

  const galleryGrads = [
    'from-orange-500 to-amber-700',
    'from-stone-600 to-stone-900',
    'from-amber-600 to-orange-800',
  ];

  return (
    <div className="space-y-6">
      <Link href="/workers" className="inline-block text-sm font-bold text-orange-700 hover:underline">
        ← {t('back')}
      </Link>

      {/* header card */}
      <section className="hero-mesh overflow-hidden rounded-[2rem] p-6 text-white shadow-[0_24px_50px_-20px_rgba(154,52,18,0.55)] ring-1 ring-orange-500/20 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative self-start">
            <Avatar name={worker.name} size="h-24 w-24 text-3xl" />
            <span
              className={`pulse-dot absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-stone-900 ${
                worker.availableToday ? 'bg-green-500' : 'bg-stone-500'
              }`}
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-black">{worker.name}</h1>
              {worker.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-xs font-bold text-white">
                  <Shield className="h-3.5 w-3.5" /> {t('verified')}
                </span>
              )}
            </div>
            <p className="mt-1 font-bold text-orange-400">
              {catName(worker.category)} · {worker.experience} {t('experience')}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-300">
              <span className="inline-flex items-center gap-1"><Pin className="h-4 w-4" /> {worker.area}</span>
              <span className="inline-flex items-center gap-1"><Stars rating={worker.rating} /> <b className="text-white">{worker.rating.toFixed(1)}</b> ({worker.jobs} {t('jobsDone')})</span>
            </div>
            <p className={`mt-2 text-sm font-bold ${worker.availableToday ? 'text-green-400' : 'text-stone-400'}`}>
              {worker.availableToday ? `● ${t('availableToday')}` : `○ ${t('notToday')}`}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="bg-gradient-to-br from-amber-300 to-orange-500 bg-clip-text text-3xl font-black text-transparent">PKR {worker.rate.toLocaleString()}</p>
            <p className="text-xs text-stone-400">PKR{t('perDay')}</p>
            <Link
              href={`/book?worker=${worker.id}`}
              className="btn-brand mt-3 px-8 py-3 text-sm"
            >
              {t('bookNow')}
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* skills + about */}
        <section className="card p-6">
          <h2 className="text-lg font-extrabold text-stone-900">{t('skills')}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {worker.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1.5 text-sm font-bold text-orange-800">
                <Check className="h-3.5 w-3.5" /> {s}
              </span>
            ))}
          </div>
          <h2 className="mt-6 text-lg font-extrabold text-stone-900">{t('about')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{worker.about}</p>
          <div className="mt-4 space-y-1.5 text-sm text-stone-600">
            <p className="inline-flex items-center gap-2"><Phone className="h-4 w-4 text-stone-400" /> {worker.phone}</p>
            <p className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-stone-400" /> {t('cnic')}: {worker.cnic}</p>
          </div>
        </section>

        {/* gallery placeholders (CSS only) */}
        <section className="card p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-stone-900">{t('workPhotos')}</h2>
            <SimBadge />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {galleryGrads.map((g, i) => (
              <div
                key={i}
                className={`flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br ${g} text-white/70`}
                aria-label={`work photo placeholder ${i + 1}`}
              >
                <CategoryIcon id={worker.category} className="h-10 w-10" />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-stone-400">CSS placeholders — no real photos in demo.</p>
        </section>
      </div>

      {/* reviews */}
      <section className="card p-6">
        <h2 className="text-lg font-extrabold text-stone-900">{t('reviews')}</h2>
        <div className="mt-3 space-y-3">
          {worker.reviews.map((r, i) => (
            <div key={i} className="rounded-2xl bg-stone-100 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-extrabold text-stone-800">{r.n}</p>
                <Stars rating={r.r} className="h-3.5 w-3.5" />
              </div>
              <p className="mt-1 text-sm text-stone-600">{r.t}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function WorkerProfilePage() {
  return (
    <Suspense>
      <ProfileInner />
    </Suspense>
  );
}
