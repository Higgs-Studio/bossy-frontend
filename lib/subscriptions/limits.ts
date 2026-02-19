import type { PlanName, PlanLimits } from './types';

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  Free: {
    maxActiveGoals: 5,
    historyDays: 7,
    canChangeBossType: false,
    defaultBossType: 'execution', // Clio is the only free boss
    features: ['basic_boss', 'daily_checkins']
  },
  Plus: {
    maxActiveGoals: -1, // unlimited
    historyDays: -1, // unlimited
    canChangeBossType: true,
    defaultBossType: 'execution',
    features: ['all_boss_types', 'unlimited_goals', 'unlimited_history', 'priority_support']
  },
  Pro: {
    maxActiveGoals: -1, // unlimited
    historyDays: -1, // unlimited
    canChangeBossType: true,
    defaultBossType: 'execution',
    features: ['all_boss_types', 'unlimited_goals', 'unlimited_history', 'priority_support']
  }
};

export function getPlanLimits(planName: PlanName): PlanLimits {
  // Fallback to Free plan if plan name is not recognized
  return PLAN_LIMITS[planName] || PLAN_LIMITS.Free;
}

export function isUnlimited(value: number): boolean {
  return value === -1;
}

// Check if a boss type is available for free users
export function isFreeBossType(bossType: string): boolean {
  return bossType === 'execution'; // Only Clio is free
}
