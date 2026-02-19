'use server';

import { redirect } from 'next/navigation';
import { customerPortalAction } from '@/lib/payments/actions';
import { getUser } from '@/lib/supabase/get-session';
import { getUserPreferences, setUserPhone, getUserPhone } from '@/lib/supabase/queries';
import { logError } from '@/lib/utils/logger';
import { getUserSubscription } from '@/lib/subscriptions/queries';

export { customerPortalAction as manageSubscriptionAction };

export async function getProfileData() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userPreferences = await getUserPreferences(user.id);
  const subscriptionData = await getUserSubscription(user.id);

  return {
    user,
    subscriptionData: subscriptionData || {
      stripe_customer_id: null,
      stripe_subscription_id: null,
      stripe_product_id: null,
      subscription_status: 'free' as const,
      plan_name: 'Free' as const,
      billing_interval: null,
      subscription_end_date: null,
    },
    userPreferences,
  };
}

export async function updatePhoneNumber(phone: string | null) {
  // Phone number updates are disabled for security reasons
  // Phone numbers can only be set during account creation
  return { 
    success: false, 
    error: 'Phone number cannot be changed for security reasons' 
  };
}

export async function getUserPhoneAction(): Promise<string | null> {
  const user = await getUser();
  if (!user) {
    return null;
  }

  try {
    const phone = await getUserPhone(user.id);
    return phone;
  } catch (error) {
    logError('Error fetching phone number', error);
    return null;
  }
}


