import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import Stripe from 'stripe';
import { logError } from '@/lib/utils/logger';
import { updateUserSubscription } from '@/lib/subscriptions/queries';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'subscription'],
    });

    if (!session.customer || typeof session.customer === 'string') {
      throw new Error('Invalid customer data from Stripe.');
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error('No subscription found for this session.');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    });

    const price = subscription.items.data[0]?.price;

    if (!price) {
      throw new Error('No price found for this subscription.');
    }

    const product = price.product as Stripe.Product;
    const productId = product.id;

    if (!productId) {
      throw new Error('No product ID found for this subscription.');
    }

    const userId = session.client_reference_id;
    if (!userId) {
      throw new Error("No user ID found in session's client_reference_id.");
    }

    // Get billing interval from price
    const billingInterval = price.recurring?.interval as 'month' | 'year';

    // Map Stripe status to our SubscriptionStatus type
    const mapStripeStatus = (status: Stripe.Subscription.Status): 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'free' => {
      switch (status) {
        case 'active':
          return 'active';
        case 'trialing':
          return 'trialing';
        case 'past_due':
          return 'past_due';
        case 'canceled':
          return 'canceled';
        case 'unpaid':
          return 'unpaid';
        case 'incomplete':
        case 'incomplete_expired':
        case 'paused':
        default:
          return 'free';
      }
    };

    // Update user subscription in user_preferences table
    await updateUserSubscription(userId, {
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_product_id: productId,
      plan_name: 'Plus',
      subscription_status: mapStripeStatus(subscription.status),
      billing_interval: billingInterval,
      subscription_end_date: (subscription as any).current_period_end 
        ? new Date((subscription as any).current_period_end * 1000).toISOString()
        : null
    });

    return NextResponse.redirect(new URL('/app/dashboard', request.url));
  } catch (error) {
    logError('Error handling successful checkout', error, { sessionId });
    return NextResponse.redirect(new URL('/pricing', request.url));
  }
}
