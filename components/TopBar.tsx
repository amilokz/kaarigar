'use client';

import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function TopBar() {
  const { t, lang, setLang } = useLang();
  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-white shadow-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-2.5">
        <a
          href="https://akclnt.com"
          className="rounded-full bg-stone-800 px-3 py-1.5 text-xs font-semibold text-orange-300 transition hover:bg-stone-700 hover:text-orange-200"
        >
          {t('moreDemos')}
        </a>
        <Link href="/" className="flex items-center gap-2" aria-label="Kaarigar home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-lg font-black text-white">
            ک
          </span>
          <span className="text-lg font-extrabold tracking-tight">
            Kaarigar <span className="ml-1 rounded bg-orange-600 px-1.5 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-white">{t('demoBadge')}</span>
          </span>
        </Link>
        <button
          onClick={() => setLang(lang === 'ur' ? 'en' : 'ur')}
          className="rounded-full border border-stone-600 px-3 py-1.5 text-xs font-bold text-stone-200 transition hover:border-orange-500 hover:text-orange-300"
          aria-label="Toggle language"
        >
          {t('langLabel')}
        </button>
      </div>
      <nav className="border-t border-stone-800 bg-stone-950/60">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-1 overflow-x-auto px-4 py-1.5 text-sm font-semibold">
          <NavLink href="/">{t('heroCta')}</NavLink>
          <NavLink href="/workers">{t('findWorkers')}</NavLink>
          <NavLink href="/onboard">{t('onboardTitle')}</NavLink>
          <NavLink href="/agent">{t('agentTitle')}</NavLink>
          <NavLink href="/admin">{t('adminTitle')}</NavLink>
        </div>
      </nav>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="whitespace-nowrap rounded-full px-3 py-1.5 text-stone-300 transition hover:bg-stone-800 hover:text-orange-300"
    >
      {children}
    </Link>
  );
}
