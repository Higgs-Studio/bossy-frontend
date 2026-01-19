import { createClient } from '@/lib/supabase/server';
import type { SubscriptionData } from './types';

export async function getUserSubscription(userId: string): Promise<SubscriptionData | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_preferences')
    .select('stripe_customer_id, stripe_subscription_id, stripe_product_id, subscription_status, plan_name, billing_interval, subscription_end_date')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No record found
    throw error;
  }

  return data as SubscriptionData;
}

export async function updateUserSubscription(
  userId: string,
  data: Partial<SubscriptionData>
): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      ...data,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id'
    });

  if (error) throw error;
}

export async function getSubscriptionByStripeCustomerId(
  customerId: string
): Promise<{ userId: string; subscription: SubscriptionData } | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_preferences')
    .select('user_id, stripe_customer_id, stripe_subscription_id, stripe_product_id, subscription_status, plan_name, billing_interval, subscription_end_date')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return {
    userId: data.user_id,
    subscription: {
      stripe_customer_id: data.stripe_customer_id,
      stripe_subscription_id: data.stripe_subscription_id,
      stripe_product_id: data.stripe_product_id,
      subscription_status: data.subscription_status,
      plan_name: data.plan_name,
      billing_interval: data.billing_interval,
      subscription_end_date: data.subscription_end_date
    }
  };
}
