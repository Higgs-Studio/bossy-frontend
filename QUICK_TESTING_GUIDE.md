# Quick Testing Guide - Stripe Improvements

## What Changed?

### 1. Added "View Pricing Plans" Button
- **Location**: Profile page, in the Subscription section
- **What it does**: Allows active subscribers to view all pricing plans
- **Why**: Users couldn't see pricing options from the profile page

### 2. Auto-Refresh After Stripe Portal
- **What it does**: Automatically updates subscription status when returning from Stripe
- **How it works**: Adds `?from=stripe` to the return URL, triggers a refresh
- **Why**: Users had to manually refresh to see subscription cancellations

### 3. Better Cancellation Status
- **What's new**: "Canceling" status with orange badge
- **Shows**: Exact date when access will end
- **Button changes**: "Reactivate Subscription" instead of "Manage Subscription"
- **Why**: Users should know they still have access until period end

## Quick Test Steps

### Test 1: View Pricing Plans (30 seconds)
1. Start dev server: `npm run dev`
2. Go to http://localhost:3000/app/profile
3. If you have an active subscription, you should see two buttons:
   - "Manage Subscription"
   - "View Pricing Plans" (NEW!)
4. Click "View Pricing Plans"
5. ✅ Should navigate to `/pricing` page

### Test 2: Cancel Subscription (2 minutes)
1. Go to http://localhost:3000/app/profile
2. Click "Manage Subscription"
3. In Stripe portal, click "Cancel Plan" → "Cancel at period end"
4. Return to app (or click the return link)
5. ✅ Should automatically show "Canceling" status (orange badge)
6. ✅ Should show "Access until [date]"
7. ✅ Button should say "Reactivate Subscription"
8. ✅ URL parameter `?from=stripe` should disappear

### Test 3: Reactivate Subscription (1 minute)
1. From canceling state, click "Reactivate Subscription"
2. In Stripe portal, click "Renew plan"
3. Return to app
4. ✅ Should automatically show "Active" status (green badge)
5. ✅ Button should say "Manage Subscription"

### Test 4: Webhook Testing (5 minutes)
**Setup Stripe CLI** (if not already done):
```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to local
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Test cancellation webhook**:
```bash
# In another terminal, trigger a subscription update
stripe trigger customer.subscription.updated
```

**Check the logs**:
- Look for "Subscription created/updated" in your app logs
- Should show `cancelAtPeriodEnd: true` or `false`

## Environment Variables to Check

Make sure these are set in your `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
BASE_URL=http://localhost:3000
```

## Common Issues & Fixes

### Issue: "View Pricing Plans" button not showing
- **Check**: Are you logged in with an active subscription?
- **Check**: Is subscription_status === 'active' or 'trialing'?

### Issue: Status not updating after cancellation
- **Check**: Webhook secret is correct
- **Check**: Stripe CLI is forwarding webhooks
- **Check**: Database connection is working
- **Try**: Wait 2-3 seconds and manually refresh

### Issue: URL parameter not disappearing
- **Check**: Browser console for errors
- **Check**: Next.js router is working correctly

## Files Modified

1. `app/app/profile/page.tsx` - Profile page with new button and refresh logic
2. `lib/payments/stripe.ts` - Updated return URL and cancellation handling
3. `lib/subscriptions/types.ts` - Added 'canceling' status type
4. `lib/subscriptions/service.ts` - Updated hasActiveSubscription function
5. `app/api/stripe/webhook/route.ts` - Enhanced logging for debugging

## Next Steps

1. Test all scenarios above
2. If everything works, commit the changes
3. Deploy to production
4. Update Stripe webhook URL in Stripe Dashboard
5. Test in production with a real subscription

## Production Checklist

- [ ] Update `BASE_URL` to production domain
- [ ] Update webhook endpoint in Stripe Dashboard
- [ ] Test webhook delivery in Stripe Dashboard
- [ ] Monitor logs for webhook errors
- [ ] Test full flow with real subscription
- [ ] Document for team/future reference

## Questions?

If you encounter any issues:
1. Check browser console for errors
2. Check server logs for webhook processing
3. Check Stripe Dashboard → Developers → Webhooks → Logs
4. Verify environment variables are set correctly
