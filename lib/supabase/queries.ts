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

  // Try with boss_type first
  let insertData: any = {
    user_id: data.userId,
    title: data.title,
    intensity: data.intensity,
    start_date: data.startDate,
    end_date: data.endDate,
    status: 'active',
  };

  // Only include boss_type if we have it (column might not exist in older schemas)
  // We'll try with it first, and if it fails with PGRST204, retry without it
  const insertDataWithBossType = {
    ...insertData,
    boss_type: data.bossType || 'execution',
  };

  console.log('[DEBUG] createGoal - inserting with boss_type:', insertDataWithBossType);

  let { data: goal, error } = await supabase
    .from('goals')
    .insert(insertDataWithBossType)
    .select()
    .single();

  // If error is about missing boss_type column, retry without it
  if (error && error.code === 'PGRST204' && error.message?.includes('boss_type')) {
    console.log('[DEBUG] createGoal - boss_type column not found, retrying without it');
    insertData = {
      ...insertData,
      // Don't include boss_type
    };

    const { data: goalRetry, error: errorRetry } = await supabase
      .from('goals')
      .insert(insertData)
      .select()
      .single();

    goal = goalRetry;
    error = errorRetry;
  }

  if (error) {
    console.error('[DEBUG] createGoal - Supabase error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    // Create a more descriptive error
    const errorMsg = error.message || error.details || error.hint || 'Database error';

    // Provide helpful message for missing column
    if (error.code === 'PGRST204') {
      throw new Error(`Database schema issue: ${errorMsg}. Please run the migration: supabase/migrations/003_add_boss_type_to_goals.sql`);
    }

    throw new Error(`Supabase error: ${errorMsg} (code: ${error.code || 'unknown'})`);
  }

  console.log('[DEBUG] createGoal - success:', goal?.id);
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

export async function updateGoal(
  goalId: string,
  userId: string,
  data: {
    title?: string;
    intensity?: 'low' | 'medium' | 'high';
    startDate?: string;
    endDate?: string;
    bossType?: BossType;
    status?: 'active' | 'completed' | 'abandoned';
  }
) {
  const supabase = await createClient();

  // Verify goal belongs to user
  const { data: goal, error: fetchError } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !goal) throw new Error('Goal not found or unauthorized');

  // Build update object
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.intensity !== undefined) updateData.intensity = data.intensity;
  if (data.startDate !== undefined) updateData.start_date = data.startDate;
  if (data.endDate !== undefined) updateData.end_date = data.endDate;
  if (data.status !== undefined) updateData.status = data.status;

  // Try with boss_type first, retry without it if column doesn't exist
  const updateDataWithBossType = {
    ...updateData,
    ...(data.bossType !== undefined && { boss_type: data.bossType })
  };

  console.log('[DEBUG] updateGoal - updating with:', updateDataWithBossType);

  let { data: updatedGoal, error } = await supabase
    .from('goals')
    .update(updateDataWithBossType)
    .eq('id', goalId)
    .eq('user_id', userId)
    .select()
    .single();

  // If error is about missing boss_type column, retry without it
  if (error && error.code === 'PGRST204' && error.message?.includes('boss_type') && data.bossType !== undefined) {
    console.log('[DEBUG] updateGoal - boss_type column not found, retrying without it');
    const updateDataWithoutBossType = { ...updateData };

    const { data: goalRetry, error: errorRetry } = await supabase
      .from('goals')
      .update(updateDataWithoutBossType)
      .eq('id', goalId)
      .eq('user_id', userId)
      .select()
      .single();

    updatedGoal = goalRetry;
    error = errorRetry;
  }

  if (error) {
    console.error('[DEBUG] updateGoal - Supabase error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: JSON.stringify(error, Object.getOwnPropertyNames(error))
    });
    // Create a more descriptive error
    const errorMsg = error.message || error.details || error.hint || 'Database error';

    // Provide helpful message for missing column
    if (error.code === 'PGRST204') {
      throw new Error(`Database schema issue: ${errorMsg}. Please run the migration: supabase/migrations/003_add_boss_type_to_goals.sql`);
    }

    throw new Error(`Supabase error: ${errorMsg} (code: ${error.code || 'unknown'})`);
  }

  console.log('[DEBUG] updateGoal - success:', updatedGoal?.id);
  return updatedGoal as Goal;
}

export async function deleteGoal(goalId: string, userId: string) {
  const supabase = await createClient();

  // Verify goal belongs to user
  const { data: goal, error: fetchError } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .eq('user_id', userId)
    .single();

  if (fetchError || !goal) throw new Error('Goal not found or unauthorized');

  // Delete goal (tasks and check-ins will be deleted via CASCADE)
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', goalId)
    .eq('user_id', userId);

  if (error) throw error;
  return true;
}

export async function getGoalById(goalId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data as Goal | null;
}

// ==========================================
// User Preferences (Boss Type at User Level)
// ==========================================

export type UserPreferences = {
  id: string;
  user_id: string;
  boss_type: BossType;
  created_at: string;
  updated_at: string;
};

export async function getUserBossType(userId: string): Promise<BossType> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_preferences')
    .select('boss_type')
    .eq('user_id', userId)
    .single();

  // If no preferences exist yet, return default
  if (error && error.code === 'PGRST116') {
    return 'execution';
  }
  if (error) throw error;
  return (data?.boss_type as BossType) || 'execution';
}

export async function setUserBossType(userId: string, bossType: BossType): Promise<UserPreferences> {
  const supabase = await createClient();
  
  // Try to update first (upsert)
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      boss_type: bossType,
    }, {
      onConflict: 'user_id',
    })
    .select()
    .single();

  if (error) throw error;
  return data as UserPreferences;
}

export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code === 'PGRST116') {
    return null;
  }
  if (error) throw error;
  return data as UserPreferences;
}

// ==========================================
// Task CRUD Operations
// ==========================================

export async function getTasksForGoal(goalId: string, userId: string): Promise<DailyTask[]> {
  const supabase = await createClient();
  
  // First verify the goal belongs to the user
  const goal = await getGoalById(goalId, userId);
  if (!goal) throw new Error('Goal not found or unauthorized');

  const { data, error } = await supabase
    .from('daily_tasks')
    .select('*')
    .eq('goal_id', goalId)
    .order('task_date', { ascending: true });

  if (error) throw error;
  return data as DailyTask[];
}

export async function createTask(data: {
  goalId: string;
  userId: string;
  taskDate: string;
  taskText: string;
}): Promise<DailyTask> {
  const supabase = await createClient();
  
  // First verify the goal belongs to the user
  const goal = await getGoalById(data.goalId, data.userId);
  if (!goal) throw new Error('Goal not found or unauthorized');

  const { data: task, error } = await supabase
    .from('daily_tasks')
    .insert({
      goal_id: data.goalId,
      task_date: data.taskDate,
      task_text: data.taskText,
    })
    .select()
    .single();

  if (error) throw error;
  return task as DailyTask;
}

export async function updateTask(
  taskId: string,
  userId: string,
  data: {
    taskText?: string;
    taskDate?: string;
  }
): Promise<DailyTask> {
  const supabase = await createClient();

  // First get the task and verify ownership through goal
  const { data: task, error: fetchError } = await supabase
    .from('daily_tasks')
    .select('*, goals!inner(user_id)')
    .eq('id', taskId)
    .single();

  if (fetchError || !task) throw new Error('Task not found');
  
  // Check if the goal belongs to the user
  const goalData = task.goals as { user_id: string };
  if (goalData.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  // Build update object
  const updateData: any = {};
  if (data.taskText !== undefined) updateData.task_text = data.taskText;
  if (data.taskDate !== undefined) updateData.task_date = data.taskDate;

  const { data: updatedTask, error } = await supabase
    .from('daily_tasks')
    .update(updateData)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return updatedTask as DailyTask;
}

export async function deleteTask(taskId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();

  // First get the task and verify ownership through goal
  const { data: task, error: fetchError } = await supabase
    .from('daily_tasks')
    .select('*, goals!inner(user_id)')
    .eq('id', taskId)
    .single();

  if (fetchError || !task) throw new Error('Task not found');
  
  // Check if the goal belongs to the user
  const goalData = task.goals as { user_id: string };
  if (goalData.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('daily_tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
  return true;
}

