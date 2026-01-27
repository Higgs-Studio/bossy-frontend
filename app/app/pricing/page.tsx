import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { PricingCards } from './pricing-cards';
import { getUser } from '@/lib/supabase/get-session';
import { getUserSubscription } from '@/lib/subscriptions/queries';
import { redirect } from 'next/navigation';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  // This page requires authentication - redirect if not logged in
  const user = await getUser();
  if (!user) {
    redirect('/pricing');
  }

  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  // Get user's subscription
  const currentSubscription = await getUserSubscription(user.id);

  const proPlan = products.find((product) => product.name === 'Plus');
  const proPrices = prices.filter((price) => price.productId === proPlan?.id);
  
  const monthlyPrice = proPrices.find((price) => price.interval === 'month');
  const yearlyPrice = proPrices.find((price) => price.interval === 'year');

  return (
    <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-muted/50 to-background">
      <main className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Simple Pricing
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you need more accountability power.
          </p>
        </div>
        <PricingCards 
          monthlyPriceId={monthlyPrice?.id}
          monthlyAmount={monthlyPrice?.unitAmount || 1000}
          yearlyPriceId={yearlyPrice?.id}
          yearlyAmount={yearlyPrice?.unitAmount || 10000}
          currentSubscription={currentSubscription}
          isLoggedIn={true}
        />
      </main>
    </div>
  );
}
