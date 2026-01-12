'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import { updateGoal, updateTask, deleteTask, getGoalById, getTasksForGoal } from '@/lib/supabase/queries';
import { logError, getErrorMessage } from '@/lib/utils/logger';
import { createClient } from '@/lib/supabase/server';

export async function getGoalWithTasks(goalId: string) {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const goal = await getGoalById(goalId, user.id);
  if (!goal) {
    redirect('/app/goals');
  }

  const tasks = await getTasksForGoal(goal.id, user.id);

  return { goal, tasks };
}

export async function updateGoalStatusAction(
  goalId: string,
  status: 'active' | 'completed' | 'abandoned'
): Promise<{ error?: string; success?: boolean }> {
  try {
    const user = await getUser();
    if (!user) {
      redirect('/sign-in');
    }

    await updateGoal(goalId, user.id, { status });

    revalidatePath('/app/goals');
    revalidatePath(`/app/goals/${goalId}`);
    revalidatePath('/app/dashboard');

    return { success: true };
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

    logError('Update goal status error', error, { goalId, status });
    const errorMessage = getErrorMessage(error);
    return { error: `Failed to update goal status: ${errorMessage}` };
  }
}

export async function createTaskAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | null> {
  try {
    const user = await getUser();
    if (!user) {
      redirect('/sign-in');
    }

    const goalId = formData.get('goalId') as string;
    const taskDate = formData.get('taskDate') as string;
    const taskText = formData.get('taskText') as string;

    if (!goalId || !taskDate || !taskText) {
      return { error: 'All fields are required' };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('daily_tasks')
      .insert({
        goal_id: goalId,
        task_date: taskDate,
        task_text: taskText,
      });

    if (error) throw error;

    revalidatePath(`/app/goals/${goalId}`);

    return null;
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

    logError('Create task error', error);
    const errorMessage = getErrorMessage(error);
    return { error: `Failed to create task: ${errorMessage}` };
  }
}

export async function updateTaskAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | null> {
  try {
    const user = await getUser();
    if (!user) {
      redirect('/sign-in');
    }

    const taskId = formData.get('taskId') as string;
    const goalId = formData.get('goalId') as string;
    const taskText = formData.get('taskText') as string;
    const taskDate = formData.get('taskDate') as string;

    if (!taskId || !taskText || !taskDate) {
      return { error: 'All fields are required' };
    }

    await updateTask(taskId, user.id, { taskText, taskDate });

    revalidatePath(`/app/goals/${goalId}`);

    return null;
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

    logError('Update task error', error);
    const errorMessage = getErrorMessage(error);
    return { error: `Failed to update task: ${errorMessage}` };
  }
}

export async function deleteTaskAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | null> {
  try {
    const user = await getUser();
    if (!user) {
      redirect('/sign-in');
    }

    const taskId = formData.get('taskId') as string;
    const goalId = formData.get('goalId') as string;

    if (!taskId) {
      return { error: 'Task ID is required' };
    }

    await deleteTask(taskId, user.id);

    revalidatePath(`/app/goals/${goalId}`);

    return null;
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

    logError('Delete task error', error);
    const errorMessage = getErrorMessage(error);
    return { error: `Failed to delete task: ${errorMessage}` };
  }
}

export async function bulkDeleteTasksAction(
  goalId: string,
  taskIds: string[]
): Promise<{ error?: string; success?: boolean }> {
  try {
    const user = await getUser();
    if (!user) {
      redirect('/sign-in');
    }

    if (!taskIds || taskIds.length === 0) {
      return { error: 'No tasks selected' };
    }

    const supabase = await createClient();

    // Delete all selected tasks
    const { error } = await supabase
      .from('daily_tasks')
      .delete()
      .in('id', taskIds);

    if (error) throw error;

    revalidatePath(`/app/goals/${goalId}`);

    return { success: true };
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

    logError('Bulk delete tasks error', error, { goalId, taskIds });
    const errorMessage = getErrorMessage(error);
    return { error: `Failed to delete tasks: ${errorMessage}` };
  }
}
