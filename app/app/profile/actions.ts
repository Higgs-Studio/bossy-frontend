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

  const subscriptionData = await getTeamForUser();
  const userPreferences = await getUserPreferences(user.id);

  return {
    user,
    subscriptionData,
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


