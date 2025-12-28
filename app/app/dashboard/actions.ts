'use server';

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import {
  getTodayTask,
  createCheckIn,
  createBossEvent,
  markTaskMissed,
  abandonGoal,
  completeGoal,
  getConsecutiveMisses,
  getActiveGoal,
} from '@/lib/supabase/queries';
import { getBossReaction } from '@/lib/boss/reactions';

export async function checkInAction(
  prevState: any,
  formData: FormData
): Promise<{ success?: string; error?: string } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const taskId = formData.get('taskId') as string;
  if (!taskId) {
    return { error: 'Task ID is required' };
  }

  try {
    // Validate task belongs to user and is today
    const todayTask = await getTodayTask(user.id);
    if (!todayTask || todayTask.id !== taskId) {
      return { error: 'Invalid task' };
    }

    const today = new Date().toISOString().split('T')[0];
    if (todayTask.task_date !== today) {
      return { error: 'This task is not for today' };
    }

    // Create check-in
    await createCheckIn({
      taskId,
      userId: user.id,
      status: 'done',
    });

    // Get active goal to use boss type
    const activeGoal = await getActiveGoal(user.id);

    // Create boss reaction
    const reaction = getBossReaction('done', { bossType: activeGoal?.boss_type });
    await createBossEvent({
      userId: user.id,
      eventType: reaction.eventType,
      context: { message: reaction.message },
    });

    return { success: 'Check-in recorded!' };
  } catch (error) {
    console.error('Check-in error:', error);
    return { error: 'Failed to record check-in' };
  }
}

export async function markMissedAction(
  prevState: any,
  formData: FormData
): Promise<{ success?: string; error?: string } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const taskId = formData.get('taskId') as string;
  if (!taskId) {
    return { error: 'Task ID is required' };
  }

  try {
    // Mark task as missed
    await markTaskMissed(taskId, user.id);

    // Get active goal to calculate consecutive misses
    const activeGoal = await getActiveGoal(user.id);
    const consecutiveMisses = activeGoal 
      ? await getConsecutiveMisses(user.id, activeGoal.id)
      : 1;

    // Create boss reaction with actual consecutive miss count and boss type
    const reaction = getBossReaction('missed', { 
      consecutiveMisses,
      bossType: activeGoal?.boss_type 
    });
    await createBossEvent({
      userId: user.id,
      eventType: reaction.eventType,
      context: { message: reaction.message },
    });

    return { success: 'Missed check-in recorded' };
  } catch (error) {
    console.error('Mark missed error:', error);
    return { error: 'Failed to record missed check-in' };
  }
}

export async function abandonGoalAction(
  prevState: any,
  formData: FormData
): Promise<{ success?: string; error?: string } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const goalId = formData.get('goalId') as string;
  if (!goalId) {
    return { error: 'Goal ID is required' };
  }

  try {
    await abandonGoal(goalId, user.id);

    // Create boss event for abandonment
    await createBossEvent({
      userId: user.id,
      eventType: 'warning',
      context: { 
        message: "You abandoned your goal. Remember, commitment means seeing things through. Think carefully before starting your next one." 
      },
    });

    redirect('/app/goal');
  } catch (error) {
    console.error('Abandon goal error:', error);
    return { error: 'Failed to abandon goal' };
  }
}

export async function completeGoalAction(
  prevState: any,
  formData: FormData
): Promise<{ success?: string; error?: string } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const goalId = formData.get('goalId') as string;
  if (!goalId) {
    return { error: 'Goal ID is required' };
  }

  try {
    await completeGoal(goalId, user.id);

    // Create boss event for completion
    await createBossEvent({
      userId: user.id,
      eventType: 'praise',
      context: { 
        message: "Goal completed. You showed up, you executed, you finished. This is what consistency looks like. Well done." 
      },
    });

    redirect('/app/goal');
  } catch (error) {
    console.error('Complete goal error:', error);
    return { error: 'Failed to complete goal' };
  }
}

