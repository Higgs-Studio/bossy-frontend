import { createClient } from './server';
import type { BossType } from '../boss/reactions';

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  intensity: 'low' | 'medium' | 'high';
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'abandoned';
  boss_type: BossType;
  created_at: string;
};

export type DailyTask = {
  id: string;
  goal_id: string;
  task_date: string;
  task_text: string;
  created_at: string;
};

export type CheckIn = {
  id: string;
  task_id: string;
  user_id: string;
  status: 'done' | 'missed';
  note: string | null;
  checked_at: string;
};

export type BossEvent = {
  id: string;
  user_id: string;
  event_type: 'praise' | 'warning' | 'escalation';
  context: Record<string, any> | null;
  created_at: string;
};

export async function getUserGoals(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Goal[];
}

export async function getActiveGoal(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Goal | null;
}

export async function getTodayTask(userId: string) {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  // Get active goal first
  const activeGoal = await getActiveGoal(userId);
  if (!activeGoal) return null;

  // Get today's task
  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('goal_id', activeGoal.id)
    .eq('task_date', today)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as DailyTask | null;
}

export async function getCheckInsForTask(taskId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('task_id', taskId)
    .order('checked_at', { ascending: false });

  if (error) throw error;
  return data as CheckIn[];
}

export async function createGoal(data: {
  userId: string;
  title: string;
  intensity: 'low' | 'medium' | 'high';
  startDate: string;
  endDate: string;
  bossType?: BossType;
}) {
  const supabase = await createClient();
  const { data: goal, error } = await supabase
    .from('goals')
    .insert({
      user_id: data.userId,
      title: data.title,
      intensity: data.intensity,
      start_date: data.startDate,
      end_date: data.endDate,
      boss_type: data.bossType || 'execution',
      status: 'active',
    })
    .select()
    .single();

  if (error) throw error;
  return goal as Goal;
}

export async function createDailyTasks(
  goalId: string,
  startDate: string,
  endDate: string,
  taskText: string
) {
  const supabase = await createClient();
  const tasks: Array<{ goal_id: string; task_date: string; task_text: string }> = [];

  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    tasks.push({
      goal_id: goalId,
      task_date: d.toISOString().split('T')[0],
      task_text: taskText,
    });
  }

  const { data, error } = await supabase
    .from('daily_tasks')
    .insert(tasks)
    .select();

  if (error) throw error;
  return data as DailyTask[];
}

export async function createCheckIn(data: {
  taskId: string;
  userId: string;
  status: 'done' | 'missed';
  note?: string;
}) {
  const supabase = await createClient();
  const { data: checkIn, error } = await supabase
    .from('check_ins')
    .insert({
      task_id: data.taskId,
      user_id: data.userId,
      status: data.status,
      note: data.note || null,
    })
    .select()
    .single();

  if (error) throw error;
  return checkIn as CheckIn;
}

export async function markTaskMissed(taskId: string, userId: string) {
  const supabase = await createClient();
  
  // Check if check-in already exists
  const { data: existing } = await supabase
    .from('check_ins')
    .select('id')
    .eq('task_id', taskId)
    .eq('user_id', userId)
    .single();

  if (existing) {
    // Update existing check-in
    const { data, error } = await supabase
      .from('check_ins')
      .update({ status: 'missed' })
      .eq('id', existing.id)
      .select()
      .single();
    
    if (error) throw error;
    return data as CheckIn;
  } else {
    // Create new missed check-in
    return await createCheckIn({
      taskId,
      userId,
      status: 'missed',
    });
  }
}

export async function createBossEvent(data: {
  userId: string;
  eventType: 'praise' | 'warning' | 'escalation';
  context?: Record<string, any>;
}) {
  const supabase = await createClient();
  const { data: event, error } = await supabase
    .from('boss_events')
    .insert({
      user_id: data.userId,
      event_type: data.eventType,
      context: data.context || null,
    })
    .select()
    .single();

  if (error) throw error;
  return event as BossEvent;
}

export async function getRecentBossEvents(userId: string, limit: number = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('boss_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as BossEvent[];
}

export async function abandonGoal(goalId: string, userId: string) {
  const supabase = await createClient();
  
  // Verify goal belongs to user
  const { data: goal, error: fetchError } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !goal) throw new Error('Goal not found or unauthorized');

  // Update goal status to abandoned
  const { data, error } = await supabase
    .from('goals')
    .update({ status: 'abandoned' })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Goal;
}

export async function completeGoal(goalId: string, userId: string) {
  const supabase = await createClient();
  
  // Verify goal belongs to user
  const { data: goal, error: fetchError } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !goal) throw new Error('Goal not found or unauthorized');

  // Update goal status to completed
  const { data, error } = await supabase
    .from('goals')
    .update({ status: 'completed' })
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Goal;
}

export async function getConsecutiveMisses(userId: string, goalId: string): Promise<number> {
  const supabase = await createClient();
  
  // Get all tasks for this goal ordered by date descending
  const { data: tasks, error: tasksError } = await supabase
    .from('daily_tasks')
    .select('id, task_date')
    .eq('goal_id', goalId)
    .lte('task_date', new Date().toISOString().split('T')[0])
    .order('task_date', { ascending: false });

  if (tasksError || !tasks) return 0;

  let consecutiveMisses = 0;
  
  // Check each task from most recent backwards
  for (const task of tasks) {
    // Get check-in for this task
    const { data: checkIns, error: checkInError } = await supabase
      .from('check_ins')
      .select('*')
      .eq('task_id', task.id)
      .eq('user_id', userId);

    if (checkInError) continue;

    // If no check-in or missed check-in
    if (!checkIns || checkIns.length === 0 || checkIns[0].status === 'missed') {
      consecutiveMisses++;
    } else if (checkIns[0].status === 'done') {
      // Found a completed task, stop counting
      break;
    }
  }

  return consecutiveMisses;
}

