import { getUserSubscription } from './queries';
import { getPlanLimits, isUnlimited } from './limits';
import { getUserGoals } from '@/lib/supabase/queries';
import type { UserPlan, PlanName } from './types';

export async function getUserPlan(userId: string): Promise<UserPlan> {
  const subscription = await getUserSubscription(userId);
  
  const planName: PlanName = subscription?.plan_name || 'Free';
  const limits = getPlanLimits(planName);

  return {
    planName,
    subscriptionStatus: subscription?.subscription_status || 'free',
    billingInterval: subscription?.billing_interval || null,
    limits
  };
}

export async function canCreateGoal(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  
  // Unlimited goals for Plus
  if (isUnlimited(plan.limits.maxActiveGoals)) {
    return true;
  }

  // Check current active goals count
  const goals = await getUserGoals(userId);
  const activeGoals = goals.filter(g => g.status === 'active');
  
  return activeGoals.length < plan.limits.maxActiveGoals;
}

export async function getActiveGoalsCount(userId: string): Promise<number> {
  const goals = await getUserGoals(userId);
  return goals.filter(g => g.status === 'active').length;
}

export async function canChangeBossType(userId: string): Promise<boolean> {
  const plan = await getUserPlan(userId);
  return plan.limits.canChangeBossType;
}

export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription?.subscription_status === 'active' || 
         subscription?.subscription_status === 'trialing';
}
