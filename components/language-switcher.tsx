'use client';

import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/translation-context';

const languages = [
  { code: 'en' as const, label: 'English', flag: '🇺🇸' },
  { code: 'zh-TW' as const, label: '繁體中文', flag: '🇹🇼' },
  { code: 'zh-CN' as const, label: '简体中文', flag: '🇨🇳' },
  { code: 'zh-HK' as const, label: '粵語', flag: '🇭🇰' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-white">
          <Globe className="h-4 w-4" />
          <span className="text-sm">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLocale(lang.code)}
            className={`cursor-pointer text-slate-300 hover:text-white hover:bg-slate-700 ${
              locale === lang.code ? 'bg-slate-700' : ''
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

