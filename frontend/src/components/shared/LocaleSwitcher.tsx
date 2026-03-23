"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Globe } from 'lucide-react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  const locales = [
    { code: 'pt-BR', label: '🇧🇷 PT' },
    { code: 'en', label: '🇺🇸 EN' },
    { code: 'es', label: '🇪🇸 ES' }
  ];

  return (
    <div className="flex items-center gap-2 bg-slate-100/50 p-1 rounded-full border border-slate-200 shadow-sm">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => handleLocaleChange(l.code)}
          className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
            locale === l.code 
              ? "bg-white text-blue-600 shadow-md" 
              : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
