# Stripe Integration Testing Checklist

Complete testing guide for the Stripe subscription integration in the Bossy app.

## Prerequisites

- [ ] Supabase DDL statements executed
- [ ] All existing users have `subscription_status = 'free'`
- [ ] Stripe test mode configured
- [ ] Stripe CLI running (`stripe listen --forward-to localhost:3000/api/stripe/webhook`)
- [ ] Environment variables set in `.env.local`

## Test Environment

### Test Cards

- **Successful payment**: `4242 4242 4242 4242`
- **Requires authentication**: `4000 0025 0000 3155`
- **Declined card**: `4000 0000 0000 9995`
- **Expiry**: Any future date (e.g., 12/34)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## Phase 1: Free Plan Tests

### Test 1.1: New User Sign Up

- [ ] Go to `/sign-up`
- [ ] Create a new account
- [ ] Verify redirect to dashboard
- [ ] **Expected**: User automatically has Free plan

**Verify in Database**:
```sql
SELECT user_id, subscription_status, plan_name 
FROM user_preferences 
WHERE user_id = 'YOUR_USER_ID';
```
**Expected**: `subscription_status = 'free'`, `plan_name = 'Free'`

### Test 1.2: Create First Goal (Free Plan)

- [ ] Go to `/app/goal`
- [ ] Fill in goal details
- [ ] Submit form
- [ ] **Expected**: Goal created successfully

### Test 1.3: Try to Create Second Goal (Free Plan - Should Block)

- [ ] Try to create another goal
- [ ] **Expected**: Error message "Goal limit reached. You're on the Free plan (1/1 active goals). Upgrade to Pro for unlimited goals."

### Test 1.4: Boss Type Selection (Free Plan - Should Block)

- [ ] Go to `/app/boss`
- [ ] Try to select a different boss type
- [ ] Click "Save Changes"
- [ ] **Expected**: Error message "Upgrade to Pro to unlock all boss personalities"

## Phase 2: Pricing Page Tests

### Test 2.1: Pricing Page Display

- [ ] Go to `/pricing`
- [ ] **Verify**:
  - [ ] Free plan card shows "1 active goal" and "Default boss only"
  - [ ] Pro plan card shows "Unlimited active goals" and "All boss personalities"
  - [ ] Monthly/Yearly toggle visible
  - [ ] "Save X%" badge on Yearly option

### Test 2.2: Billing Toggle

- [ ] Click "Monthly" tab
- [ ] **Verify**: Price updates to monthly amount
- [ ] Click "Yearly" tab
- [ ] **Verify**: Price updates to yearly amount
- [ ] **Verify**: Monthly equivalent shown (e.g., "$8.33/month")

## Phase 3: Subscription Upgrade (Monthly)

### Test 3.1: Checkout Flow (Monthly)

- [ ] On pricing page, select "Monthly" billing
- [ ] Click "Get Started" on Pro plan
- [ ] **Verify**: Redirected to Stripe Checkout
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Complete payment
- [ ] **Expected**: Redirected to `/app/dashboard`

### Test 3.2: Verify Subscription Status

**Check Database**:
```sql
SELECT 
  user_id,
  subscription_status,
  plan_name,
  billing_interval,
  stripe_customer_id,
  stripe_subscription_id
FROM user_preferences 
WHERE user_id = 'YOUR_USER_ID';
```

**Expected**:
- `subscription_status = 'active'`
- `plan_name = 'Pro'`
- `billing_interval = 'month'`
- `stripe_customer_id` is set
- `stripe_subscription_id` is set

### Test 3.3: Verify Unlimited Goals

- [ ] Go to `/app/goal`
- [ ] Create a 2nd goal
- [ ] **Expected**: Goal created successfully
- [ ] Create a 3rd goal
- [ ] **Expected**: Goal created successfully
- [ ] **Verify**: No limit on goals

### Test 3.4: Verify Boss Type Selection

- [ ] Go to `/app/boss`
- [ ] Select a different boss type
- [ ] Click "Save Changes"
- [ ] **Expected**: Boss type changed successfully

### Test 3.5: Profile Page Display

- [ ] Go to `/app/profile`
- [ ] **Verify**:
  - [ ] Status shows "Active" with green badge
  - [ ] Plan shows "Pro (Billed Monthly)"
  - [ ] "Manage Subscription" button visible

## Phase 4: Customer Portal Tests

### Test 4.1: Access Customer Portal

- [ ] On profile page, click "Manage Subscription"
- [ ] **Expected**: Redirected to Stripe Customer Portal

### Test 4.2: Switch from Monthly to Yearly

- [ ] In Customer Portal, click "Update plan"
- [ ] Select the Yearly price
- [ ] Confirm change
- [ ] Return to app
- [ ] **Verify in Profile**: "Pro (Billed Yearly)"

**Check Database**:
```sql
SELECT billing_interval 
FROM user_preferences 
WHERE user_id = 'YOUR_USER_ID';
```
**Expected**: `billing_interval = 'year'`

### Test 4.3: Update Payment Method

- [ ] In Customer Portal, click "Update payment method"
- [ ] Add a new test card
- [ ] **Expected**: Card updated successfully

### Test 4.4: Cancel Subscription

- [ ] In Customer Portal, click "Cancel subscription"
- [ ] Select cancellation reason
- [ ] Confirm cancellation (at period end)
- [ ] **Expected**: Subscription marked for cancellation

**Check Stripe Dashboard**:
- Subscription should show "Cancels on [DATE]"

### Test 4.5: Webhook - Subscription Canceled

**Trigger**: Wait for subscription period to end, OR manually cancel immediately in Stripe Dashboard

- [ ] After cancellation, check database:

```sql
SELECT subscription_status, plan_name, stripe_subscription_id
FROM user_preferences 
WHERE user_id = 'YOUR_USER_ID';
```

**Expected**:
- `subscription_status = 'free'` or `'canceled'`
- `plan_name = 'Free'`
- `stripe_subscription_id = NULL`

- [ ] **Verify**: Can only create 1 active goal again
- [ ] **Verify**: Cannot change boss type

## Phase 5: Subscription Upgrade (Yearly)

### Test 5.1: Checkout Flow (Yearly)

- [ ] Start with free plan
- [ ] Go to `/pricing`
- [ ] Select "Yearly" billing
- [ ] Click "Get Started" on Pro plan
- [ ] Complete checkout with test card
- [ ] **Expected**: Redirected to dashboard

### Test 5.2: Verify Yearly Subscription

**Check Database**:
```sql
SELECT billing_interval, subscription_status 
FROM user_preferences 
WHERE user_id = 'YOUR_USER_ID';
```

**Expected**:
- `billing_interval = 'year'`
- `subscription_status = 'active'`

- [ ] Go to Profile page
- [ ] **Verify**: "Pro (Billed Yearly)"

## Phase 6: Payment Failure Tests

### Test 6.1: Failed Payment

- [ ] In Stripe Dashboard (Test mode), go to subscription
- [ ] Click "..." → "Update subscription"
- [ ] Under "Payment", click "Fail next invoice"
- [ ] Wait for next billing attempt (or trigger manually)

**Check webhook logs for `invoice.payment_failed` event**

- [ ] **Verify**: Subscription status updates to `past_due`

### Test 6.2: Recovered Payment

- [ ] In Stripe Dashboard, update payment method to working card
- [ ] Retry payment
- [ ] **Check webhook** for `invoice.payment_succeeded`
- [ ] **Verify**: Subscription status returns to `active`

## Phase 7: Edge Cases

### Test 7.1: Duplicate Webhook Events

- [ ] In Stripe Dashboard, go to Events
- [ ] Find a `customer.subscription.updated` event
- [ ] Click "Send test webhook"
- [ ] **Verify**: No duplicate subscriptions or errors
- [ ] **Check logs**: Should handle idempotently

### Test 7.2: User with No Preferences Record

- [ ] Create new user via Supabase Auth directly
- [ ] Log in to app
- [ ] **Expected**: Defaults to Free plan automatically

### Test 7.3: Concurrent Goal Creation

- [ ] Have 0 active goals on Free plan
- [ ] Open two browser tabs
- [ ] Try to create goals simultaneously
- [ ] **Expected**: Only one succeeds, other shows limit error

## Phase 8: Production Pre-Flight

### Before Going Live

- [ ] All test scenarios pass
- [ ] Switch to Stripe Live mode
- [ ] Create products/prices in Live mode
- [ ] Set up production webhook
- [ ] Update environment variables
- [ ] Test with real card (small amount)
- [ ] Verify webhook delivery in production
- [ ] Monitor Stripe Dashboard for errors
- [ ] Set up Stripe email notifications

## Troubleshooting

### Webhook Not Received

```bash
# Check Stripe CLI is running
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Manually resend webhook
stripe events resend evt_xxxxx
```

### Subscription Not Updating

1. Check webhook logs in Stripe Dashboard
2. Check application logs for errors
3. Manually query database:
   ```sql
   SELECT * FROM user_preferences WHERE user_id = 'USER_ID';
   ```
4. If stuck, manually update:
   ```sql
   UPDATE user_preferences 
   SET subscription_status = 'active', plan_name = 'Pro'
   WHERE user_id = 'USER_ID';
   ```

### Goals Still Limited After Upgrade

1. Hard refresh browser (Ctrl+Shift+R)
2. Check database subscription_status
3. Try logging out and back in
4. Check server logs for errors in `canCreateGoal()`

## Success Criteria

All tests should pass with these results:

✅ Free users can create 1 goal only
✅ Free users cannot change boss type
✅ Pro users can create unlimited goals
✅ Pro users can select any boss type
✅ Monthly/yearly billing toggle works
✅ Stripe checkout completes successfully
✅ Webhooks update subscription status
✅ Customer Portal allows plan changes
✅ Subscription cancellation reverts to free
✅ Payment failures handled correctly
✅ Profile page shows correct subscription info

## Reporting Issues

When reporting issues, include:
1. Test scenario number
2. Expected vs actual behavior
3. Database query results
4. Stripe Dashboard event logs
5. Application server logs
6. Browser console errors (if any)
