import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { PricingCards } from './pricing-cards';
import { getUser } from '@/lib/supabase/get-session';
import { getUserSubscription } from '@/lib/subscriptions/queries';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products, user] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
    getUser(),
  ]);

  // Get user's subscription if logged in
  let currentSubscription = null;
  if (user) {
    currentSubscription = await getUserSubscription(user.id);
  }

  const proPlan = products.find((product) => product.name === 'Plus');
  const proPrices = prices.filter((price) => price.productId === proPlan?.id);
  
  const monthlyPrice = proPrices.find((price) => price.interval === 'month');
  const yearlyPrice = proPrices.find((price) => price.interval === 'year');

  return (
    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Simple Pricing
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start free. Upgrade when you need more accountability power.
          </p>
        </div>
        <PricingCards 
          monthlyPriceId={monthlyPrice?.id}
          monthlyAmount={monthlyPrice?.unitAmount || 1000}
          yearlyPriceId={yearlyPrice?.id}
          yearlyAmount={yearlyPrice?.unitAmount || 10000}
          currentSubscription={currentSubscription}
          isLoggedIn={!!user}
        />
      </main>
    </div>
  );
}

