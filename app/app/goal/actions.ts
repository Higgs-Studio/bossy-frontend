'use server';

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import {
  createGoal,
  createDailyTasks,
  updateGoal,
  deleteGoal,
  getGoalById,
  getUserBossType,
} from '@/lib/supabase/queries';

export async function createGoalAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const title = formData.get('title') as string;
  const timeHorizon = parseInt(formData.get('timeHorizon') as string);
  const intensity = formData.get('intensity') as 'low' | 'medium' | 'high';
  const startDate = formData.get('startDate') as string;

  if (!title || !timeHorizon || isNaN(timeHorizon) || !intensity || !startDate) {
    return { error: 'All fields are required' };
  }

  try {
    // Get user's boss type from preferences
    const bossType = await getUserBossType(user.id);

    // Calculate end date
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + timeHorizon - 1);

    // Create goal with user's boss type
    const goal = await createGoal({
      userId: user.id,
      title: title.trim(),
      intensity,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      bossType,
    });

    // Generate task text based on intensity
    const taskText =
      intensity === 'high'
        ? `Work 90 minutes on: ${title}`
        : intensity === 'medium'
          ? `Work 60 minutes on: ${title}`
          : `Work 30 minutes on: ${title}`;

    // Generate daily tasks
    await createDailyTasks(
      goal.id,
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0],
      taskText
    );

    redirect('/app/dashboard');
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

    console.error('Create goal error:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    } else {
      errorMessage = String(error);
    }

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
  const timeHorizonStr = formData.get('timeHorizon') as string;
  const timeHorizon = parseInt(timeHorizonStr);

  if (!goalId || !title || !timeHorizon || isNaN(timeHorizon) || !intensity || !startDate) {
    return { error: 'All fields are required' };
  }

  try {
    // Verify goal exists and belongs to user
    const existingGoal = await getGoalById(goalId, user.id);
    if (!existingGoal) {
      return { error: 'Goal not found or unauthorized' };
    }

    // Calculate end date
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + timeHorizon - 1);

    // Update goal (boss type stays the same - it's user-level now)
    await updateGoal(goalId, user.id, {
      title: title.trim(),
      intensity,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
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

    console.error('Update goal error:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    } else {
      errorMessage = String(error);
    }

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
    console.error('Delete goal error:', error);
    return { error: 'Failed to delete goal. Please try again.' };
  }
}
