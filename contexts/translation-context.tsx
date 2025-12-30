'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Locale } from '@/i18n.config';

type TranslationContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: any; // Translations object
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children, initialTranslations }: { children: ReactNode; initialTranslations: any }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [translations, setTranslations] = useState(initialTranslations);

  // Load saved language preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('preferred-language') as Locale;
    if (saved && (saved === 'en' || saved === 'zh-TW' || saved === 'zh-CN')) {
      setLocale(saved);
    }
  }, []);

  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('preferred-language', newLocale);
    
    // Load translations dynamically
    try {
      const dict = await import(`@/dictionaries/${newLocale}.json`);
      setTranslations(dict.default);
    } catch (error) {
      console.error('Failed to load translations:', error);
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


