'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/supabase/get-session';
import {
  markTaskDone,
  abandonGoal,
  completeGoal,
  createBossEvent,
} from '@/lib/supabase/queries';
import { logError } from '@/lib/utils/logger';
import type { ActionState } from '@/lib/auth/middleware';

export async function markTaskDoneAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const taskId = formData.get('taskId') as string;
  if (!taskId) {
    return { error: 'Task ID is required' };
  }

  try {
    // Mark task as done (this also validates ownership)
    await markTaskDone(taskId, user.id);

    // Revalidate the dashboard page to refresh the data
    revalidatePath('/app/dashboard');

    return { success: 'Task marked as done!' };
  } catch (error) {
    logError('Mark task done error', error, { userId: user.id, taskId });
    return { error: 'Failed to mark task as done' };
  }
}

export async function abandonGoalAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState | null> {
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
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState | null> {
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

