'use server';

import { redirect } from 'next/navigation';
import { customerPortalAction } from '@/lib/payments/actions';
import { getUser } from '@/lib/supabase/get-session';
import { getTeamForUser } from '@/lib/db/queries';
import { getUserPreferences, setUserPhone } from '@/lib/supabase/queries';

export { customerPortalAction as manageSubscriptionAction };

export async function getProfileData() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userPreferences = await getUserPreferences(user.id);

  return {
    user,
    subscriptionData: userPreferences ? {
      stripe_customer_id: userPreferences.stripe_customer_id,
      stripe_subscription_id: userPreferences.stripe_subscription_id,
      subscription_status: userPreferences.subscription_status || 'free',
      plan_name: userPreferences.plan_name || 'Free',
      billing_interval: userPreferences.billing_interval,
      subscription_end_date: userPreferences.subscription_end_date,
    } : null,
    userPreferences,
  };
}

export async function updatePhoneNumber(phone: string | null) {
  const user = await getUser();
  if (!user) {
    throw new Error('Not authenticated');
  }

  try {
    await setUserPhone(user.id, phone);
    return { success: true };
  } catch (error) {
    console.error('Error updating phone number:', error);
    return { success: false, error: 'Failed to update phone number' };
  }
}


