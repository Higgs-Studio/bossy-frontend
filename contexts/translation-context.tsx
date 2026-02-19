'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Locale } from '@/i18n.config';
import { logError } from '@/lib/utils/logger';
import type en from '@/dictionaries/en.json';

export type Translations = typeof en;

type TranslationContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children, initialTranslations }: { children: ReactNode; initialTranslations: Translations }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Translations>(initialTranslations);

  useEffect(() => {
    const saved = localStorage.getItem('preferred-language') as Locale;
    if (saved && (saved === 'en' || saved === 'zh-TW' || saved === 'zh-CN' || saved === 'zh-HK')) {
      setLocale(saved);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferred-language', newLocale);

    try {
      const dict = await import(`@/dictionaries/${newLocale}.json`);
      setTranslations(dict.default);
    } catch (error) {
      logError('Failed to load translations', error, { locale: newLocale });
    }
  };

  return (
    <TranslationContext.Provider value={{ locale, setLocale, t: translations }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
}
