'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { checkoutAction } from '@/lib/payments/actions';
import { SubmitButton } from './submit-button';
import { Button } from '@/components/ui/button';

type BillingInterval = 'month' | 'year';

type PricingCardsProps = {
  monthlyPriceId?: string;
  monthlyAmount: number;
  yearlyPriceId?: string;
  yearlyAmount: number;
};

export function PricingCards({
  monthlyPriceId,
  monthlyAmount,
  yearlyPriceId,
  yearlyAmount,
}: PricingCardsProps) {
  const [interval, setInterval] = useState<BillingInterval>('month');

  const activePriceId = interval === 'month' ? monthlyPriceId : yearlyPriceId;
  const activeAmount = interval === 'month' ? monthlyAmount : yearlyAmount;
  
  // Calculate savings for yearly plan
  const monthlyCost = monthlyAmount / 100;
  const yearlyCost = yearlyAmount / 100;
  const yearlyMonthlyCost = yearlyCost / 12;
  const savingsPercent = Math.round(((monthlyCost - yearlyMonthlyCost) / monthlyCost) * 100);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setInterval('month')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              interval === 'month'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('year')}
            className={`px-6 py-2 rounded-md font-medium transition-all relative ${
              interval === 'year'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Yearly
            {savingsPercent > 0 && (
              <span className="absolute -top-3 -right-3 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                Save {savingsPercent}%
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <FreePlanCard />
        <ProPlanCard
          priceId={activePriceId}
          amount={activeAmount}
          interval={interval}
        />
      </div>
    </div>
  );
}

function FreePlanCard() {
  return (
    <div className="relative pt-8 border-2 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free</h2>
      <div className="mb-6">
        <p className="text-5xl font-bold text-slate-900 dark:text-white mb-1">
          Free
        </p>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          forever
        </p>
      </div>
      <ul className="space-y-4 mb-8">
        {[
          '1 active goal',
          'Default boss only',
          '7 days of history',
          'Daily check-ins',
        ].map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
      <Button asChild className="w-full" variant="outline" size="lg">
        <a href="/sign-up">Get Started</a>
      </Button>
    </div>
  );
}

function ProPlanCard({
  priceId,
  amount,
  interval,
}: {
  priceId?: string;
  amount: number;
  interval: BillingInterval;
}) {
  return (
    <div className="relative pt-8 border-2 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl border-primary/30 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10 shadow-lg">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="px-4 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-full shadow-lg">
          Popular
        </span>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Pro</h2>
      <div className="mb-6">
        <p className="text-5xl font-bold text-slate-900 dark:text-white mb-1">
          ${amount / 100}
        </p>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          per {interval}
          {interval === 'year' && (
            <span className="text-sm block text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              ${((amount / 100) / 12).toFixed(2)}/month
            </span>
          )}
        </p>
      </div>
      <ul className="space-y-4 mb-8">
        {[
          'Unlimited active goals',
          'All boss personalities',
          'Unlimited history',
          'Priority support',
        ].map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{feature}</span>
          </li>
        ))}
      </ul>
      <form action={checkoutAction}>
        <input type="hidden" name="priceId" value={priceId} />
        <SubmitButton />
      </form>
    </div>
  );
}
