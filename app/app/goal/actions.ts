'use server';

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import {
  createGoal,
  updateGoal,
  deleteGoal,
  getGoalById,
  getUserBossType,
} from '@/lib/supabase/queries';
import { canCreateGoal, getUserPlan, getActiveGoalsCount } from '@/lib/subscriptions/service';
import { logError, getErrorMessage } from '@/lib/utils/logger';

export async function createGoalAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const title = formData.get('title') as string;
  const intensity = formData.get('intensity') as 'low' | 'medium' | 'high';
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;

  if (!title || !intensity || !startDate || !endDate) {
    return { error: 'All fields are required' };
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end <= start) {
    return { error: 'End date must be after start date' };
  }

  try {
    // Check subscription limits before creating goal
    const canCreate = await canCreateGoal(user.id);
    if (!canCreate) {
      const plan = await getUserPlan(user.id);
      const activeCount = await getActiveGoalsCount(user.id);
      return { 
        error: `Goal limit reached. You're on the ${plan.planName} plan (${activeCount}/${plan.limits.maxActiveGoals} active goal${plan.limits.maxActiveGoals === 1 ? '' : 's'}). Upgrade to Plus for unlimited goals.`
      };
    }

    // Get user's boss type from preferences
    const bossType = await getUserBossType(user.id);

    // Create goal with user's boss type
    const goal = await createGoal({
      userId: user.id,
      title: title.trim(),
      intensity,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      bossType,
    });

    // Redirect to goal detail page where user can add tasks
    redirect(`/app/goals/${goal.id}`);
  } catch (error) {
    // Re-throw redirect errors
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.includes('NEXT_REDIRECT')
    ) {
      throw error;
    }

    logError('Create goal error', error, { userId: user.id, title });
    const errorMessage = getErrorMessage(error);
    return { error: `Failed to create goal: ${errorMessage}` };
  }
}

export async function updateGoalAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const goalId = formData.get('goalId') as string;
  const title = formData.get('title') as string;
  const intensity = formData.get('intensity') as 'low' | 'medium' | 'high';
  const startDate = formData.get('startDate') as string;
  const endDate = formData.get('endDate') as string;
  const status = formData.get('status') as 'active' | 'completed' | 'abandoned';

  if (!goalId || !title || !intensity || !startDate || !endDate || !status) {
    return { error: 'All fields are required' };
  }

  // Validate dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end <= start) {
    return { error: 'End date must be after start date' };
  }

  try {
    // Verify goal exists and belongs to user
    const existingGoal = await getGoalById(goalId, user.id);
    if (!existingGoal) {
      return { error: 'Goal not found or unauthorized' };
    }

    // Update goal (boss type stays the same - it's user-level now)
    await updateGoal(goalId, user.id, {
      title: title.trim(),
      intensity,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      status,
    });

    redirect('/app/goals');
  } catch (error) {
    // Re-throw redirect errors
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.includes('NEXT_REDIRECT')
    ) {
      throw error;
    }

    logError('Update goal error', error, { userId: user.id, goalId });
    const errorMessage = getErrorMessage(error);
    return { error: `Failed to update goal: ${errorMessage}` };
  }
}

export async function deleteGoalAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const goalId = formData.get('goalId') as string;
  if (!goalId) {
    return { error: 'Goal ID is required' };
  }

  try {
    await deleteGoal(goalId, user.id);
    redirect('/app/goals');
  } catch (error) {
    // Re-throw redirect errors
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof error.digest === 'string' &&
      error.digest.includes('NEXT_REDIRECT')
    ) {
      throw error;
    }
    logError('Delete goal error', error, { userId: user.id, goalId });
    return { error: 'Failed to delete goal. Please try again.' };
  }
}
