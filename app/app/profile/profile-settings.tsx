'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Globe } from 'lucide-react';
import { useTranslation } from '@/contexts/translation-context';
import type { Locale } from '@/i18n.config';

const LANGUAGE_OPTIONS = [
  { code: 'en' as Locale, flag: '🇺🇸' },
  { code: 'zh-CN' as Locale, flag: '🇨🇳' },
  { code: 'zh-TW' as Locale, flag: '🇹🇼' },
  { code: 'zh-HK' as Locale, flag: '🇭🇰' },
];

export function ProfileSettings() {
  const { locale, setLocale, t } = useTranslation();

  return (
    <Card className="border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-muted-foreground" />
          <CardTitle>{t.profile.appLanguage}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t.profile.appLanguageDesc}
          </p>
          <RadioGroup
            value={locale}
            onValueChange={(value) => setLocale(value as Locale)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <label
                key={lang.code}
                htmlFor={`app-lang-${lang.code}`}
                className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  locale === lang.code
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-sm'
                    : 'border-border hover:border-border/80 hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={lang.code} id={`app-lang-${lang.code}`} />
                <div className="cursor-pointer flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <span className="font-medium text-sm block">{t.languages[lang.code]}</span>
                      <span className="text-xs text-muted-foreground">{lang.code}</span>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
