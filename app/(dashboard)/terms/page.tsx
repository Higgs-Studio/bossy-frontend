'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/translation-context';
import { formatTemplate } from '@/lib/i18n/format';

export default function TermsPage() {
  const { t, locale } = useTranslation();
  const dateText = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

  return (
    <main className="min-h-screen py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            {t.legalPages.common.backToHome}
          </Link>
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-4">{t.legalPages.terms.title}</h1>
        <p className="text-slate-600 mb-8">
          {formatTemplate(t.legalPages.common.lastUpdated, { date: dateText })}
        </p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.acceptance.title}</h2>
            {t.legalPages.terms.sections.acceptance.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.useLicense.title}</h2>
            {t.legalPages.terms.sections.useLicense.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.terms.sections.useLicense.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.accountRegistration.title}</h2>
            {t.legalPages.terms.sections.accountRegistration.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.terms.sections.accountRegistration.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.userConduct.title}</h2>
            {t.legalPages.terms.sections.userConduct.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.terms.sections.userConduct.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.subscriptionPayment.title}</h2>
            {t.legalPages.terms.sections.subscriptionPayment.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.refundPolicy.title}</h2>
            {t.legalPages.terms.sections.refundPolicy.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.goalCommitments.title}</h2>
            {t.legalPages.terms.sections.goalCommitments.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.terms.sections.goalCommitments.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.disclaimer.title}</h2>
            {t.legalPages.terms.sections.disclaimer.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.limitations.title}</h2>
            {t.legalPages.terms.sections.limitations.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.termination.title}</h2>
            {t.legalPages.terms.sections.termination.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.changesToTerms.title}</h2>
            {t.legalPages.terms.sections.changesToTerms.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.governingLaw.title}</h2>
            {t.legalPages.terms.sections.governingLaw.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.terms.sections.contactInformation.title}</h2>
            {t.legalPages.terms.sections.contactInformation.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
            <p className="text-slate-700">
              {t.legalPages.common.labels.email}: {t.legalPages.terms.sections.contactInformation.email}<br />
              {t.legalPages.common.labels.address}: {t.legalPages.terms.sections.contactInformation.addressPlaceholder}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

