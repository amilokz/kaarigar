'use client';

import { useLang } from '@/lib/i18n';
import { WhatsAppGlyph } from './icons';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative mt-16 overflow-hidden bg-gradient-to-b from-stone-950 to-black text-stone-300">
      {/* warm glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500" />
      <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[42rem] -translate-x-1/2 rounded-full bg-orange-600/15 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-5 px-4 py-12 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-700 text-2xl font-black text-white shadow-[0_8px_20px_-6px_rgba(234,88,12,0.8)] ring-1 ring-white/25">
          ک
        </span>
        <p className="text-base font-extrabold tracking-tight text-white sm:text-lg">{t('footerNote')}</p>
        <p className="max-w-xl text-xs leading-relaxed text-stone-500">{t('sampleDataNote')}</p>

        <div className="mt-2 w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur sm:p-6">
          <p className="text-sm font-bold text-orange-300">{t('footerCtaTitle')}</p>
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green mt-4 w-full px-6 py-3.5 text-sm sm:w-auto"
          >
            <WhatsAppGlyph className="h-5 w-5" />
            {t('buildForBusiness')}
          </a>
        </div>

        <p className="mt-2 text-[11px] font-medium text-stone-600">
          Demo — sample data. Built by AKCLNT.
        </p>
      </div>
    </footer>
  );
}
