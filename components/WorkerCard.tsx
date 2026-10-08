'use client';

import { useLang } from '@/lib/i18n';
import { avatarColor, initials, type Worker } from '@/lib/workers';
import { Check, Pin, Shield, Star } from './icons';

export function Stars({ rating, className = 'h-4 w-4' }: { rating: number; className?: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 text-amber-500" aria-label={`rating ${rating}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`${className} ${i <= Math.round(rating) ? '' : 'text-stone-300'}`} />
      ))}
    </span>
  );
}

export function Avatar({ name, size = 'h-16 w-16 text-xl' }: { name: string; size?: string }) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-extrabold text-white ${avatarColor(name)} ${size}`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export default function WorkerCard({ worker }: { worker: Worker }) {
  const { t, catName } = useLang();
  return (
    <a
      href={`/worker?id=${worker.id}`}
      className="card-lift flex gap-4 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm"
    >
      <div className="relative">
        <Avatar name={worker.name} />
        <span
          title={worker.availableToday ? t('availableToday') : t('notToday')}
          className={`pulse-dot absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white ${
            worker.availableToday ? 'bg-green-600' : 'bg-stone-400'
          }`}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-base font-bold text-stone-900">{worker.name}</h3>
          {worker.verified && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
              <Shield className="h-3 w-3" />
              {t('verified')}
            </span>
          )}
        </div>
        <p className="text-sm font-semibold text-orange-700">{catName(worker.category)}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
          <Pin className="h-3 w-3" /> {worker.area}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
          <span className="font-extrabold text-stone-900">
            PKR {worker.rate.toLocaleString()}
            <span className="font-normal text-stone-500">{t('perDay')}</span>
          </span>
          <span className="inline-flex items-center gap-1 text-stone-700">
            <Stars rating={worker.rating} className="h-3.5 w-3.5" />
            <b>{worker.rating.toFixed(1)}</b>
          </span>
          <span className="text-xs text-stone-500">
            {worker.jobs} {t('jobsDone')}
          </span>
        </div>
        <p className={`mt-1.5 text-xs font-bold ${worker.availableToday ? 'text-green-700' : 'text-stone-500'}`}>
          {worker.availableToday ? `● ${t('availableToday')}` : `○ ${t('notToday')}`}
        </p>
      </div>
    </a>
  );
}

export function SimBadge() {
  const { t } = useLang();
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-stone-800 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
      <Check className="h-3 w-3" /> {t('aiSimulated')}
    </span>
  );
}
