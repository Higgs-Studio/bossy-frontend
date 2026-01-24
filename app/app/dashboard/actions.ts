'use server';

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import {
  getTodayTasks,
  createCheckIn,
  createBossEvent,
  markTaskMissed,
  abandonGoal,
  completeGoal,
  getConsecutiveMisses,
  getActiveGoals,
} from '@/lib/supabase/queries';
import { getBossReaction } from '@/lib/boss/reactions';
import { logError } from '@/lib/utils/logger';

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
    const todayTasks = await getTodayTasks(user.id);
    const todayTask = todayTasks.find(task => task.id === taskId);
    
    if (!todayTask) {
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

    // Get active goals to use boss type (use first goal's boss type)
    const activeGoals = await getActiveGoals(user.id);
    const bossType = activeGoals.length > 0 ? activeGoals[0].boss_type : undefined;

    // Create boss reaction
    const reaction = getBossReaction('done', { bossType });
    await createBossEvent({
      userId: user.id,
      eventType: reaction.eventType,
      context: { message: reaction.message },
    });

    return { success: 'Check-in recorded!' };
  } catch (error) {
    logError('Check-in error', error, { userId: user.id, taskId });
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

    // Get active goals to calculate consecutive misses
    const activeGoals = await getActiveGoals(user.id);
    
    // Calculate max consecutive misses across all active goals
    let maxConsecutiveMisses = 1;
    let bossType = undefined;
    
    if (activeGoals.length > 0) {
      const missesPromises = activeGoals.map(goal => 
        getConsecutiveMisses(user.id, goal.id)
      );
      const missesResults = await Promise.all(missesPromises);
      maxConsecutiveMisses = Math.max(...missesResults, 1);
      bossType = activeGoals[0].boss_type;
    }

    // Create boss reaction with actual consecutive miss count and boss type
    const reaction = getBossReaction('missed', { 
      consecutiveMisses: maxConsecutiveMisses,
      bossType
    });
    await createBossEvent({
      userId: user.id,
      eventType: reaction.eventType,
      context: { message: reaction.message },
    });

    return { success: 'Missed check-in recorded' };
  } catch (error) {
    logError('Mark missed error', error, { userId: user.id, taskId });
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
    logError('Abandon goal error', error, { userId: user.id, goalId });
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
    logError('Complete goal error', error, { userId: user.id, goalId });
    return { error: 'Failed to complete goal' };
  }
}

