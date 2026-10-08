'use client';

import { useLang } from '@/lib/i18n';
import { clearAll } from '@/lib/store';

export default function ResetButton({ className = '' }: { className?: string }) {
  const { t } = useLang();
  return (
    <button
      onClick={() => {
        if (window.confirm(t('resetDemo') + '?')) {
          clearAll();
          alert(t('resetConfirm'));
          window.location.reload();
        }
      }}
      className={`rounded-full border-2 border-dashed border-stone-400 px-4 py-2 text-sm font-bold text-stone-600 transition hover:border-red-500 hover:text-red-600 ${className}`}
    >
      ↺ {t('resetDemo')}
    </button>
  );
}
