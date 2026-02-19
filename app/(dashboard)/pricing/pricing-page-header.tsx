'use client';

import { useTranslation } from '@/contexts/translation-context';

export function PricingPageHeader() {
  const { t } = useTranslation();

  return (
    <div className="text-center mb-12 sm:mb-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
        {t.pricing.pageTitle}
      </h1>
      <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        {t.pricing.pageSubtitle}
      </p>
    </div>
  );
}
