import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';
import { logError, logInfo } from '@/lib/utils/logger';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    logError('Webhook signature verification failed', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        // Initial subscription created
        const session = event.data.object as Stripe.Checkout.Session;
        logInfo('Checkout session completed', { sessionId: session.id });
        // Subscription data is already saved in checkout route
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // Subscription activated or updated (plan change, monthly to yearly)
        const updatedSubscription = event.data.object as Stripe.Subscription;
        logInfo('Subscription created/updated', { 
          subscriptionId: updatedSubscription.id,
          status: updatedSubscription.status 
        });
        await handleSubscriptionChange(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        // Subscription canceled - revert to free
        const deletedSubscription = event.data.object as Stripe.Subscription;
        logInfo('Subscription deleted', { subscriptionId: deletedSubscription.id });
        await handleSubscriptionChange(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        // Payment succeeded - ensure subscription is active
        const successInvoice = event.data.object as Stripe.Invoice;
        // Type assertion needed because Stripe types don't expose subscription field properly
        const successSubscription = (successInvoice as any).subscription;
        if (successSubscription) {
          const subscriptionId = typeof successSubscription === 'string' 
            ? successSubscription 
            : successSubscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          logInfo('Payment succeeded, updating subscription', { subscriptionId });
          await handleSubscriptionChange(subscription);
        }
        break;

      case 'invoice.payment_failed':
        // Payment failed - mark as past_due
        const failedInvoice = event.data.object as Stripe.Invoice;
        // Type assertion needed because Stripe types don't expose subscription field properly
        const failedSubscription = (failedInvoice as any).subscription;
        if (failedSubscription) {
          const subscriptionId = typeof failedSubscription === 'string' 
            ? failedSubscription 
            : failedSubscription.id;
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          logInfo('Payment failed, updating subscription', { 
            subscriptionId,
            status: subscription.status 
          });
          await handleSubscriptionChange(subscription);
        }
        break;

      default:
        logInfo(`Unhandled webhook event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logError('Error processing webhook', error, { eventType: event.type });
    // Return 200 to acknowledge receipt even if processing failed
    // This prevents Stripe from retrying indefinitely
    return NextResponse.json({ received: true, error: 'Processing failed' });
  }
}
