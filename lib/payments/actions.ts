'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { getUser } from '@/lib/supabase/get-session';

export async function checkoutAction(formData: FormData) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ userId: user.id, priceId });
}

export async function customerPortalAction() {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const portalSession = await createCustomerPortalSession(user.id);
  redirect(portalSession.url);
}
