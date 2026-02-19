'use client';

import Link from 'next/link';
import { useTranslation } from '@/contexts/translation-context';
import { formatTemplate } from '@/lib/i18n/format';

export default function PrivacyPage() {
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

        <h1 className="text-4xl font-bold text-slate-900 mb-4">{t.legalPages.privacy.title}</h1>
        <p className="text-slate-600 mb-8">
          {formatTemplate(t.legalPages.common.lastUpdated, { date: dateText })}
        </p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.introduction.title}</h2>
            {t.legalPages.privacy.sections.introduction.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.informationWeCollect.title}</h2>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">{t.legalPages.privacy.sections.informationWeCollect.personalInformationTitle}</h3>
            <p className="text-slate-700 leading-relaxed mb-4">{t.legalPages.privacy.sections.informationWeCollect.personalInformationIntro}</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.privacy.sections.informationWeCollect.personalInformationBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">{t.legalPages.privacy.sections.informationWeCollect.usageInformationTitle}</h3>
            <p className="text-slate-700 leading-relaxed mb-4">{t.legalPages.privacy.sections.informationWeCollect.usageInformationIntro}</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.privacy.sections.informationWeCollect.usageInformationBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.howWeUse.title}</h2>
            <p className="text-slate-700 leading-relaxed mb-4">{t.legalPages.privacy.sections.howWeUse.intro}</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.privacy.sections.howWeUse.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.sharing.title}</h2>
            <p className="text-slate-700 leading-relaxed mb-4">{t.legalPages.privacy.sections.sharing.intro}</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.privacy.sections.sharing.bullets.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.description}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.dataSecurity.title}</h2>
            <p className="text-slate-700 leading-relaxed mb-4">{t.legalPages.privacy.sections.dataSecurity.intro}</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.privacy.sections.dataSecurity.bullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">{t.legalPages.privacy.sections.dataSecurity.outro}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.dataRetention.title}</h2>
            {t.legalPages.privacy.sections.dataRetention.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.rights.title}</h2>
            <p className="text-slate-700 leading-relaxed mb-4">{t.legalPages.privacy.sections.rights.intro}</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.privacy.sections.rights.bullets.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.description}
                </li>
              ))}
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">{t.legalPages.privacy.sections.rights.outro}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.cookies.title}</h2>
            {t.legalPages.privacy.sections.cookies.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              {t.legalPages.privacy.sections.cookies.bullets.map((item) => (
                <li key={item.label}>
                  <strong>{item.label}:</strong> {item.description}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.thirdParty.title}</h2>
            {t.legalPages.privacy.sections.thirdParty.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.children.title}</h2>
            {t.legalPages.privacy.sections.children.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.internationalTransfers.title}</h2>
            {t.legalPages.privacy.sections.internationalTransfers.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.changes.title}</h2>
            {t.legalPages.privacy.sections.changes.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{t.legalPages.privacy.sections.contact.title}</h2>
            {t.legalPages.privacy.sections.contact.paragraphs.map((p) => (
              <p key={p} className="text-slate-700 leading-relaxed mb-4">{p}</p>
            ))}
            <p className="text-slate-700">
              {t.legalPages.common.labels.email}: {t.legalPages.privacy.sections.contact.email}<br />
              {t.legalPages.common.labels.address}: {t.legalPages.privacy.sections.contact.addressPlaceholder}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

