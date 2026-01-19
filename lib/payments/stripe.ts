import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import {
  getUserSubscription,
  updateUserSubscription,
  getSubscriptionByStripeCustomerId
} from '@/lib/subscriptions/queries';
import { logError } from '@/lib/utils/logger';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil'
});

export async function createCheckoutSession({
  userId,
  priceId
}: {
  userId: string;
  priceId: string;
}) {
  const user = await getUser();

  if (!user) {
    redirect(`/sign-in?redirect=checkout&priceId=${priceId}`);
  }

  // Get existing subscription data
  const subscription = await getUserSubscription(userId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    customer: subscription?.stripe_customer_id || undefined,
    client_reference_id: userId,
    allow_promotion_codes: true
    // No trial period
  });

  redirect(session.url!);
}

export async function createCustomerPortalSession(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription?.stripe_customer_id || !subscription?.stripe_product_id) {
    redirect('/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(subscription.stripe_product_id);
    if (!product.active) {
      throw new Error("User's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the user's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription'
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id)
            }
          ]
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other'
            ]
          }
        },
        payment_method_update: {
          enabled: true
        }
      }
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.BASE_URL}/app/profile`,
    configuration: configuration.id
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const userSubscription = await getSubscriptionByStripeCustomerId(customerId);

  if (!userSubscription) {
    logError('User not found for Stripe customer', undefined, { customerId });
    return;
  }

  const { userId } = userSubscription;

  if (status === 'active' || status === 'trialing') {
    const plan = subscription.items.data[0]?.price;
    const product = plan?.product as Stripe.Product;
    const billingInterval = plan?.recurring?.interval as 'month' | 'year';

    await updateUserSubscription(userId, {
      stripe_subscription_id: subscriptionId,
      stripe_product_id: product.id,
      plan_name: 'Pro',
      subscription_status: status,
      billing_interval: billingInterval,
      subscription_end_date: subscription.current_period_end 
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null
    });
  } else if (status === 'canceled' || status === 'unpaid' || status === 'past_due') {
    // Revert to free plan
    await updateUserSubscription(userId, {
      stripe_subscription_id: null,
      stripe_product_id: null,
      plan_name: 'Free',
      subscription_status: status === 'canceled' ? 'free' : status,
      billing_interval: null,
      subscription_end_date: null
    });
  }
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring'
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days
  }));
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id
  }));
}
