'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang } from '@/lib/i18n';

const NAV = [
  { href: '/', key: 'heroCta' },
  { href: '/workers', key: 'findWorkers' },
  { href: '/onboard', key: 'onboardTitle' },
  { href: '/agent', key: 'agentTitle' },
  { href: '/admin', key: 'adminTitle' },
] as const;

export default function TopBar() {
  const { t, lang, setLang } = useLang();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-stone-950 to-stone-900 text-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Kaarigar home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-700 text-xl font-black text-white shadow-[0_6px_16px_-4px_rgba(234,88,12,0.7)] ring-1 ring-white/25 transition-transform duration-200 group-hover:scale-105">
            ک
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Kaarigar{' '}
            <span className="ml-1 rounded-md bg-gradient-to-r from-orange-600 to-amber-500 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-widest text-white shadow-sm">
              {t('demoBadge')}
            </span>
          </span>
        </Link>
        <button
          onClick={() => setLang(lang === 'ur' ? 'en' : 'ur')}
          className="rounded-full border border-stone-700 bg-stone-800/60 px-4 py-1.5 text-xs font-bold text-stone-200 transition hover:border-orange-500 hover:text-orange-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 active:scale-95"
          aria-label="Toggle language"
        >
          {t('langLabel')}
        </button>
      </div>
      <nav aria-label="Primary" className="border-t border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-4 py-2 text-sm font-semibold">
          {NAV.map((item) => {
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap rounded-full px-3.5 py-1.5 transition ${
                  active
                    ? 'bg-orange-600 text-white shadow-[0_4px_14px_-4px_rgba(234,88,12,0.8)]'
                    : 'text-stone-300 hover:bg-white/10 hover:text-orange-300'
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
