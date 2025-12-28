import { checkoutAction } from '@/lib/payments/actions';
import { Check } from 'lucide-react';
import { getStripePrices, getStripeProducts } from '@/lib/payments/stripe';
import { SubmitButton } from './submit-button';
import { Button } from '@/components/ui/button';
import { PublicHeader } from '@/components/public-header';

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  const [prices, products] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const proPlan = products.find((product) => product.name === 'Pro');
  const proPrice = prices.find((price) => price.productId === proPlan?.id);

  return (
    <>
      <PublicHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-br from-gray-50 to-white min-h-screen">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Simple Pricing
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Start free. Upgrade when you need more accountability power.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        <PricingCard
          name="Free"
          price={0}
          interval="forever"
          trialDays={0}
          features={[
            '1 active goal',
            'Basic boss personality',
            '7 days of history',
            'Daily check-ins',
          ]}
          priceId={undefined}
          isFree={true}
        />
        <PricingCard
          name={proPlan?.name || 'Pro'}
          price={proPrice?.unitAmount || 1000}
          interval={proPrice?.interval || 'month'}
          trialDays={proPrice?.trialPeriodDays || 7}
          features={[
            'Unlimited goals',
            'Stronger boss language',
            'Unlimited history',
            'Priority support',
            'Future: Social accountability',
          ]}
          priceId={proPrice?.id}
          isFree={false}
        />
      </div>
    </main>
    </>
  );
}

function PricingCard({
  name,
  price,
  interval,
  trialDays,
  features,
  priceId,
  isFree,
}: {
  name: string;
  price: number;
  interval: string;
  trialDays: number;
  features: string[];
  priceId?: string;
  isFree?: boolean;
}) {
  const isPro = !isFree;
  
  return (
    <div className={`relative pt-8 border-2 rounded-2xl p-8 transition-all duration-300 hover:shadow-xl ${
      isPro 
        ? 'border-primary/30 bg-gradient-to-br from-white to-primary/5 shadow-lg' 
        : 'border-slate-200 bg-white hover:shadow-lg'
    }`}>
      {isPro && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="px-4 py-1 bg-slate-900 text-white text-sm font-semibold rounded-full shadow-lg">
            Popular
          </span>
        </div>
      )}
      <h2 className="text-2xl font-bold text-slate-900 mb-2">{name}</h2>
      {trialDays > 0 && (
        <p className="text-sm text-primary font-semibold mb-4">
          {trialDays} day free trial
        </p>
      )}
      <div className="mb-6">
        <p className="text-5xl font-bold text-slate-900 mb-1">
          {isFree ? (
            'Free'
          ) : (
            <>
              ${price / 100}
            </>
          )}
        </p>
        {!isFree && (
          <p className="text-lg text-slate-600">
            per {interval}
          </p>
        )}
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-4 w-4 text-primary" />
            </div>
            <span className="text-slate-700 leading-relaxed">{feature}</span>
          </li>
        ))}
      </ul>
      {isFree ? (
        <Button asChild className="w-full" variant="outline" size="lg">
          <a href="/sign-up">Get Started</a>
        </Button>
      ) : (
        <form action={checkoutAction}>
          <input type="hidden" name="priceId" value={priceId} />
          <SubmitButton />
        </form>
      )}
    </div>
  );
}
