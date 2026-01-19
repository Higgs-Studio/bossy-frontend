export type PlanName = 'Free' | 'Pro';
export type SubscriptionStatus = 'free' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid';
export type BillingInterval = 'month' | 'year';

export interface SubscriptionData {
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_product_id: string | null;
  subscription_status: SubscriptionStatus;
  plan_name: PlanName;
  billing_interval: BillingInterval | null;
  subscription_end_date: string | null;
}

export interface PlanLimits {
  maxActiveGoals: number; // -1 = unlimited
  historyDays: number; // -1 = unlimited
  canChangeBossType: boolean;
  defaultBossType: string;
  features: string[];
}

export interface UserPlan {
  planName: PlanName;
  subscriptionStatus: SubscriptionStatus;
  billingInterval: BillingInterval | null;
  limits: PlanLimits;
}
