'use client';

import { useLang } from '@/lib/i18n';
import { WhatsAppGlyph } from './icons';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-10 border-t-4 border-orange-600 bg-stone-900 text-stone-300">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-8 text-center">
        <p className="text-sm font-semibold">{t('footerNote')}</p>
        <p className="max-w-xl text-xs text-stone-500">{t('sampleDataNote')}</p>
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-green-500"
        >
          <WhatsAppGlyph className="h-5 w-5" />
          {t('buildForBusiness')}
        </a>
      </div>
    </footer>
  );
}
