'use server';

import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/get-session';
import {
  getActiveGoal,
  createGoal,
  createDailyTasks,
} from '@/lib/supabase/queries';

export async function createGoalAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string } | null> {
  const user = await getUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Check if user already has an active goal
  const existingGoal = await getActiveGoal(user.id);
  if (existingGoal) {
    return { error: 'You already have an active goal' };
  }

  const title = formData.get('title') as string;
  const timeHorizon = parseInt(formData.get('timeHorizon') as string);
  const intensity = formData.get('intensity') as 'low' | 'medium' | 'high';
  const startDate = formData.get('startDate') as string;
  const bossType = (formData.get('bossType') as string) || 'execution';

  if (!title || !timeHorizon || !intensity || !startDate) {
    return { error: 'All fields are required' };
  }

  try {
    // Calculate end date
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + timeHorizon - 1);

    // Create goal
    const goal = await createGoal({
      userId: user.id,
      title: title.trim(),
      intensity,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      bossType: bossType as any,
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
    console.error('Create goal error:', error);
    return { error: 'Failed to create goal. Please try again.' };
  }
}

