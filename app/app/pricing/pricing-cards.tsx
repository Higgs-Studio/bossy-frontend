'use client';

import { useState } from 'react';
import { Check, Crown } from 'lucide-react';
import { checkoutAction, customerPortalAction } from '@/lib/payments/actions';
import { SubmitButton } from './submit-button';
import { Button } from '@/components/ui/button';
import type { SubscriptionData } from '@/lib/subscriptions/types';

type BillingInterval = 'month' | 'year';

type PricingCardsProps = {
  monthlyPriceId?: string;
  monthlyAmount: number;
  yearlyPriceId?: string;
  yearlyAmount: number;
  currentSubscription: SubscriptionData | null;
  isLoggedIn: boolean;
};

export function PricingCards({
  monthlyPriceId,
  monthlyAmount,
  yearlyPriceId,
  yearlyAmount,
  currentSubscription,
  isLoggedIn,
}: PricingCardsProps) {
  // Set initial interval based on current subscription or default to monthly
  const defaultInterval: BillingInterval =
    currentSubscription?.billing_interval === 'year' ? 'year' : 'month';
  const [interval, setInterval] = useState<BillingInterval>(defaultInterval);

  const activePriceId = interval === 'month' ? monthlyPriceId : yearlyPriceId;
  const activeAmount = interval === 'month' ? monthlyAmount : yearlyAmount;

  // Calculate savings for yearly plan
  const monthlyCost = monthlyAmount / 100;
  const yearlyCost = yearlyAmount / 100;
  const yearlyMonthlyCost = yearlyCost / 12;
  const savingsPercent = Math.round(((monthlyCost - yearlyMonthlyCost) / monthlyCost) * 100);

  // Determine current plan status
  const isOnFreePlan = !currentSubscription || currentSubscription.plan_name === 'Free' ||
    currentSubscription.subscription_status === 'free';
  const isOnPlusPlan = currentSubscription?.plan_name === 'Plus' &&
    (currentSubscription.subscription_status === 'active' ||
      currentSubscription.subscription_status === 'trialing' ||
      currentSubscription.subscription_status === 'canceling');
  const currentBillingInterval = currentSubscription?.billing_interval;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Billing Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <button
            onClick={() => setInterval('month')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${interval === 'month'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('year')}
            className={`px-6 py-2 rounded-md font-medium transition-all relative ${interval === 'year'
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
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 overflow-visible">
        <FreePlanCard
          isCurrentPlan={isOnFreePlan}
          isLoggedIn={isLoggedIn}
        />
        <ProPlanCard
          priceId={activePriceId}
          amount={activeAmount}
          interval={interval}
          isCurrentPlan={isOnPlusPlan && currentBillingInterval === interval}
          isOnPlusPlan={isOnPlusPlan}
          currentBillingInterval={currentBillingInterval}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}

function FreePlanCard({ isCurrentPlan, isLoggedIn }: { isCurrentPlan: boolean; isLoggedIn: boolean }) {
  return (
    <div className={`relative pt-8 border-2 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl ${isCurrentPlan
        ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 shadow-lg'
        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-lg'
      }`}>
      {isCurrentPlan && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="px-4 py-1 bg-primary text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Current Plan
          </span>
        </div>
      )}
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
      {isCurrentPlan ? (
        <Button className="w-full" variant="outline" size="lg" disabled>
          Current Plan
        </Button>
      ) : isLoggedIn ? (
        <form action={customerPortalAction}>
          <SubmitButton text="Cancel Subscription" variant="outline" />
        </form>
      ) : (
        <Button asChild className="w-full" variant="outline" size="lg">
          <a href="/sign-up">Get Started</a>
        </Button>
      )}
    </div>
  );
}

function ProPlanCard({
  priceId,
  amount,
  interval,
  isCurrentPlan,
  isOnPlusPlan,
  currentBillingInterval,
  isLoggedIn,
}: {
  priceId?: string;
  amount: number;
  interval: BillingInterval;
  isCurrentPlan: boolean;
  isOnPlusPlan: boolean;
  currentBillingInterval: BillingInterval | null | undefined;
  isLoggedIn: boolean;
}) {
  // Determine button text and action
  let buttonText = 'Get Started';
  let buttonAction: 'checkout' | 'manage' | 'disabled' = 'checkout';

  if (isCurrentPlan) {
    buttonText = 'Manage Subscription';
    buttonAction = 'manage';
  } else if (isOnPlusPlan) {
    // User is on Plus but different billing interval
    buttonText = interval === 'month' ? 'Switch to Monthly' : 'Switch to Yearly';
    buttonAction = 'checkout';
  } else if (isLoggedIn) {
    // User is on Free plan
    buttonText = 'Upgrade to Plus';
    buttonAction = 'checkout';
  }

  return (
    <div className={`relative pt-8 border-2 rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:shadow-xl overflow-visible ${isCurrentPlan
        ? 'border-primary bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5 shadow-xl'
        : 'border-primary/30 bg-gradient-to-br from-white to-primary/5 dark:from-slate-900 dark:to-primary/10 shadow-lg'
      }`}>
      {/* Show either "Popular" OR "Current" badge, not both */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        {isCurrentPlan ? (
          <span className="px-4 py-1 bg-emerald-600 text-white text-sm font-semibold rounded-full shadow-lg flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Current Plan
          </span>
        ) : (
          <span className="px-4 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold rounded-full shadow-lg">
            Popular
          </span>
        )}
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Plus</h2>
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

      {buttonAction === 'manage' ? (
        <form action={customerPortalAction}>
          <SubmitButton text={buttonText} variant="outline" />
        </form>
      ) : (
        <form action={checkoutAction}>
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton text={buttonText} />
        </form>
      )}
    </div>
  );
}
