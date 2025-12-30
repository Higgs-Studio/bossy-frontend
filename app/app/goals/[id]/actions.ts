'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getUser } from '@/lib/supabase/get-session';
import { createTask, updateTask, deleteTask } from '@/lib/supabase/queries';

export async function createTaskAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
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

  try {
    await createTask({
      goalId,
      userId: user.id,
      taskDate,
      taskText: taskText.trim(),
    });
    
    revalidatePath(`/app/goals/${goalId}`);
    return { success: true };
  } catch (error) {
    console.error('Create task error:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to create task. Please try again.' };
  }
}

export async function updateTaskAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const taskId = formData.get('taskId') as string;
  const goalId = formData.get('goalId') as string;
  const taskText = formData.get('taskText') as string;

  if (!taskId || !taskText) {
    return { error: 'Task ID and text are required' };
  }

  try {
    await updateTask(taskId, user.id, {
      taskText: taskText.trim(),
    });
    
    revalidatePath(`/app/goals/${goalId}`);
    return { success: true };
  } catch (error) {
    console.error('Update task error:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to update task. Please try again.' };
  }
}

export async function deleteTaskAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  const taskId = formData.get('taskId') as string;
  const goalId = formData.get('goalId') as string;

  if (!taskId) {
    return { error: 'Task ID is required' };
  }

  try {
    await deleteTask(taskId, user.id);
    
    revalidatePath(`/app/goals/${goalId}`);
    return { success: true };
  } catch (error) {
    console.error('Delete task error:', error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Failed to delete task. Please try again.' };
  }
}

