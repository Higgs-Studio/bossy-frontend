import Link from 'next/link';
import { PublicHeader } from '@/components/public-header';

export default function TermsPage() {
  return (
    <>
      <PublicHeader />
      <main className="min-h-screen py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-slate-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              By accessing and using Bossy ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Use License</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Permission is granted to temporarily access and use the Service for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to decompile or reverse engineer any software contained in the Service</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Account Registration</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              To use certain features of the Service, you must register for an account. When you register, you agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and accept all risks of unauthorized access</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. User Conduct</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You agree not to use the Service to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Violate any local, state, national, or international law</li>
              <li>Infringe on the intellectual property rights of others</li>
              <li>Transmit any harmful or malicious code</li>
              <li>Harass, abuse, or harm another person</li>
              <li>Collect or track personal information of others without consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Subscription and Payment</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (such as monthly or annually). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a subscription.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              At the end of each billing cycle, your subscription will automatically renew unless you cancel it or we cancel it. You may cancel your subscription renewal through your account settings or by contacting our support team.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Refund Policy</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We offer a 7-day money-back guarantee for new subscriptions. If you are not satisfied with the Service within the first 7 days of your subscription, you may request a full refund by contacting our support team. After 7 days, all payments are non-refundable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Goal Commitments</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              When you set a goal in Bossy, you are making a commitment to yourself. While we provide accountability features to help you stay on track, you understand that:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2 mb-4">
              <li>Goals cannot be edited once set, as part of the commitment mechanism</li>
              <li>Your progress is tracked and recorded for accountability purposes</li>
              <li>The Service provides feedback based on your check-in patterns</li>
              <li>You are solely responsible for your own actions and goal achievement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Disclaimer</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              The materials on Bossy are provided on an 'as is' basis. Bossy makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Bossy is not a medical, therapeutic, or counseling service. The Service is designed for goal tracking and accountability only. If you are experiencing mental health issues, please consult with a qualified professional.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Limitations</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              In no event shall Bossy or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Bossy, even if Bossy or a Bossy authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Termination</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to delete your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms of Service on this page and updating the "Last updated" date.
            </p>
            <p className="text-slate-700 leading-relaxed mb-4">
              Your continued use of the Service after any such changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Governing Law</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              These terms shall be governed and construed in accordance with the laws of the jurisdiction in which Bossy operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Contact Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-slate-700">
              Email: legal@bossy.app<br />
              Address: [Your Company Address]
            </p>
          </section>
        </div>
      </div>
    </main>
    </>
  );
}

