# Stripe Integration Setup Guide

This document explains how to set up Stripe for the Bossy application with subscription management.

## Overview

The Bossy app uses Stripe for:
- **Free Plan**: Automatic (no payment required)
- **Pro Plan**: Paid subscription with monthly or yearly billing
- **Customer Portal**: Users can manage their own subscriptions

## Prerequisites

1. **Stripe Account**: Create an account at [stripe.com](https://stripe.com)
2. **Supabase Database**: Ensure your database has the `user_preferences` table with subscription fields

## Step 1: Get Stripe API Keys

### Development (Test Mode)

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Make sure you're in **Test mode** (toggle in top right)
3. Go to **Developers** → **API keys**
4. Copy the following keys:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Production (Live Mode)

1. Switch to **Live mode** in Stripe Dashboard
2. Go to **Developers** → **API keys**
3. Copy the following keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

## Step 2: Create Products and Prices

### Create Pro Product

1. Go to **Products** in Stripe Dashboard
2. Click **+ Add product**
3. Fill in:
   - **Name**: `Pro`
   - **Description**: `Pro plan with unlimited features`
4. Click **Save product**

### Add Monthly Price

1. In the Pro product page, click **Add another price**
2. Fill in:
   - **Price**: Your monthly price (e.g., `10.00`)
   - **Billing period**: `Monthly`
   - **Currency**: `USD` (or your currency)
3. Click **Add price**
4. **Copy the Price ID** (starts with `price_`) - you'll need this for testing

### Add Yearly Price

1. Click **Add another price** again
2. Fill in:
   - **Price**: Your yearly price (e.g., `100.00`)
   - **Billing period**: `Yearly`
   - **Currency**: `USD` (or your currency)
3. Click **Add price**
4. **Copy the Price ID** (starts with `price_`)

**Important**: Make sure both prices are **active**. The app will automatically fetch both prices based on the product name "Pro".

## Step 3: Set Up Webhooks

### Local Development Webhook

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli):
   ```bash
   # Windows (with Scoop)
   scoop install stripe
   
   # Or download from https://github.com/stripe/stripe-cli/releases
   ```

2. Login to Stripe CLI:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`) that appears in the terminal

### Production Webhook

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **+ Add endpoint**
3. Fill in:
   - **Endpoint URL**: `https://yourdomain.com/api/stripe/webhook`
   - **Description**: `Bossy Production Webhook`
4. Click **Select events** and add:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

## Step 4: Configure Environment Variables

Create or update your `.env.local` file:

```bash
# Stripe Keys (Test mode for development)
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx

# Base URL for redirects
BASE_URL=http://localhost:3000

# For production, use live keys:
# STRIPE_SECRET_KEY=sk_live_xxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxx (from production webhook)
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
# BASE_URL=https://yourdomain.com
```

## Step 5: Configure Customer Portal

The app automatically creates a Stripe Customer Portal configuration on first use, but you can pre-configure it:

1. Go to **Settings** → **Billing** → **Customer portal** in Stripe Dashboard
2. Configure:
   - **Headline**: "Manage your subscription"
   - **Allow customers to**:
     - ✅ Update payment methods
     - ✅ Update subscription (switch between monthly/yearly)
     - ✅ Cancel subscription (at period end)
   - **Cancellation reasons**: Enable with options like "Too expensive", "Missing features", etc.
3. Click **Save**

## Step 6: Test the Integration

### Test Cards

Use these test card numbers in test mode:

- **Success**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined**: `4000 0000 0000 9995`

**Expiry**: Any future date
**CVC**: Any 3 digits
**ZIP**: Any valid ZIP code

### Test Flow

1. **Sign up** for a free account
2. **Create 1 goal** (should work)
3. **Try to create a 2nd goal** (should be blocked)
4. **Go to Pricing page** (`/pricing`)
5. **Toggle between Monthly/Yearly** billing
6. **Click "Get Started"** on Pro plan
7. **Enter test card** details
8. **Complete checkout**
9. **Verify**:
   - Redirected to dashboard
   - Can create unlimited goals
   - Profile page shows "Pro" plan
   - Can select different boss types

10. **Test Customer Portal**:
    - Go to Profile page
    - Click "Manage Subscription"
    - Try switching between monthly/yearly
    - Try canceling subscription
    - Verify subscription status updates

## Troubleshooting

### Webhook Not Working

- **Local**: Make sure `stripe listen` is running
- **Production**: Check webhook logs in Stripe Dashboard
- **Common issue**: Webhook secret mismatch

### Prices Not Showing

- Make sure product name is exactly "Pro"
- Ensure both monthly and yearly prices are active
- Check price IDs in Stripe Dashboard

### Subscription Not Updating

- Check webhook events in Stripe Dashboard
- Look for errors in your application logs
- Verify database has subscription fields in `user_preferences`

### User Stuck on Free Plan

- Check `user_preferences.subscription_status` in database
- Manually trigger webhook by going to Stripe Dashboard → Events → Send test webhook
- Or manually update database:
  ```sql
  UPDATE user_preferences 
  SET subscription_status = 'active', 
      plan_name = 'Pro'
  WHERE user_id = 'USER_ID';
  ```

## Production Checklist

Before going live:

- [ ] Switch to Live mode in Stripe Dashboard
- [ ] Create products and prices in Live mode
- [ ] Set up production webhook endpoint
- [ ] Update environment variables with live keys
- [ ] Test complete subscription flow in production
- [ ] Monitor webhook events for first few days
- [ ] Set up Stripe email notifications
- [ ] Configure tax collection if needed
- [ ] Review Stripe Dashboard settings

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/customer-portal)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)

## Support

If you encounter issues:
1. Check Stripe Dashboard logs
2. Check application server logs
3. Review webhook event history
4. Test with Stripe CLI: `stripe events resend evt_xxxxx`
