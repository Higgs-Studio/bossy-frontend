'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/translation-context';
import { formatTemplate } from '@/lib/i18n/format';

export default function DisclaimerPage() {
  const { t, locale } = useTranslation();
  const dateText = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <main className="min-h-screen py-16 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium">
            {t.legalPages.common.backToHome}
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t.legalPages.disclaimer.title}</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {formatTemplate(t.legalPages.common.lastUpdated, { date: dateText })}
        </p>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">{t.legalPages.disclaimer.sections.dataProtection.title}</h2>
            {t.legalPages.disclaimer.sections.dataProtection.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">{t.legalPages.disclaimer.sections.eligibility.title}</h2>
            {t.legalPages.disclaimer.sections.eligibility.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">{t.legalPages.disclaimer.sections.acknowledgment.title}</h2>
            {t.legalPages.disclaimer.sections.acknowledgment.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{p}</p>
            ))}
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/sign-up"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium"
          >
            ← {t.auth.createAccount}
          </Link>
        </div>
      </div>
    </main>
  );
}
