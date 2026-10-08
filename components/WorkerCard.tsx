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
      className={`flex shrink-0 items-center justify-center rounded-full font-extrabold text-white ring-2 ring-white ${avatarColor(name)} ${size}`}
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
      className="worker-card flex gap-4 p-4 sm:p-5"
    >
      <div className="relative self-start">
        <span className={`absolute -inset-1.5 rounded-full ${worker.availableToday ? 'bg-green-500/20' : 'bg-stone-300/40'}`} aria-hidden="true" />
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
          <h3 className="truncate text-base font-extrabold tracking-tight text-stone-900 sm:text-lg">{worker.name}</h3>
          {worker.verified && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-sm">
              <Shield className="h-3 w-3" />
              {t('verified')}
            </span>
          )}
        </div>
        <p className="text-sm font-bold text-orange-700">{catName(worker.category)}</p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-stone-500">
          <Pin className="h-3 w-3" /> {worker.area}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
          <span className="text-base font-black text-stone-900">
            PKR {worker.rate.toLocaleString()}
            <span className="text-xs font-semibold text-stone-500">{t('perDay')}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-stone-700">
            <Stars rating={worker.rating} className="h-3.5 w-3.5" />
            <b>{worker.rating.toFixed(1)}</b>
          </span>
          <span className="text-xs font-medium text-stone-500">
            {worker.jobs} {t('jobsDone')}
          </span>
        </div>
        <p className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
          worker.availableToday ? 'bg-green-50 text-green-700' : 'bg-stone-100 text-stone-500'
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${worker.availableToday ? 'bg-green-600' : 'bg-stone-400'}`} aria-hidden="true" />
          {worker.availableToday ? t('availableToday') : t('notToday')}
        </p>
      </div>
    </a>
  );
}

export function SimBadge() {
  const { t } = useLang();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-stone-800 to-stone-900 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-300 ring-1 ring-white/10">
      <Check className="h-3 w-3" /> {t('aiSimulated')}
    </span>
  );
}
