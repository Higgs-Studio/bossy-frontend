import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';

export default function PrivacyPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Bossy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Personal Information</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              We collect information that you provide directly to us when you:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Register for an account (email address, name)</li>
              <li>Create and track goals</li>
              <li>Complete daily check-ins</li>
              <li>Communicate with us through support channels</li>
              <li>Subscribe to our paid services (payment information)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Usage Information</h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              We automatically collect certain information about your device when you use our Service, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Log data (IP address, browser type, operating system)</li>
              <li>Device information (device type, unique device identifiers)</li>
              <li>Usage data (pages visited, time spent, features used)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process your transactions and manage your subscriptions</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Track your goal progress and provide accountability features</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Detect, prevent, and address technical issues and fraudulent activity</li>
              <li>Send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li><strong>Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf (payment processing, data analysis, email delivery, hosting services)</li>
              <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business</li>
              <li><strong>With Your Consent:</strong> We may share your information with your consent or at your direction</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data Security</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. These measures include:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Regular backups of your data</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Data Retention</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you delete your account, we will delete your personal information within 30 days, except for information we are required to retain for legal, accounting, or security purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Your Rights and Choices</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li><strong>Access:</strong> You can request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> You can request that we correct inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> You can request deletion of your personal information</li>
              <li><strong>Portability:</strong> You can request a copy of your data in a machine-readable format</li>
              <li><strong>Objection:</strong> You can object to our processing of your personal information</li>
              <li><strong>Withdrawal of Consent:</strong> You can withdraw your consent for marketing communications at any time</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mb-4">
              To exercise these rights, please contact us at privacy@bossy.app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Types of cookies we use:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Required for the operation of our Service</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our Service</li>
              <li><strong>Preference Cookies:</strong> Remember your preferences and settings</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Third-Party Services</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our Service may contain links to third-party websites or services that are not owned or controlled by Bossy. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party websites or services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us. If we discover that a child under 13 has provided us with personal information, we will delete such information from our servers immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. International Data Transfers</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction. We will take all necessary measures to ensure that your data is treated securely and in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We will also notify you via email or through a prominent notice on our Service prior to the change becoming effective.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <p className="text-slate-700">
              Email: privacy@bossy.app<br />
              Address: [Your Company Address]
            </p>
          </section>
        </div>
      </div>
    </main>
    </>
  );
}

