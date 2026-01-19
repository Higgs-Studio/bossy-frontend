import type { PlanName, PlanLimits } from './types';

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  Free: {
    maxActiveGoals: 1,
    historyDays: 7,
    canChangeBossType: false,
    defaultBossType: 'execution',
    features: ['basic_boss', 'daily_checkins']
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
  return PLAN_LIMITS[planName];
}

export function isUnlimited(value: number): boolean {
  return value === -1;
}
