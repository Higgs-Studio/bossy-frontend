-- Bossy MVP Schema Migration (Safe Version)
-- This version uses DO blocks to safely handle existing RLS and policies
-- Use this if the regular migration fails

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  intensity TEXT NOT NULL CHECK (intensity IN ('low', 'medium', 'high')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Daily tasks table
CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  task_date DATE NOT NULL,
  task_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(goal_id, task_date)
);

-- Check-ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES daily_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('done', 'missed')),
  note TEXT,
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(task_id, user_id)
);

-- Boss events table
CREATE TABLE IF NOT EXISTS boss_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('praise', 'warning', 'escalation')),
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_goal_id ON daily_tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_task_date ON daily_tasks(task_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_task_id ON check_ins(task_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_boss_events_user_id ON boss_events(user_id);
CREATE INDEX IF NOT EXISTS idx_boss_events_created_at ON boss_events(created_at);

-- Row Level Security (RLS) - Safe to enable multiple times
DO $$ 
BEGIN
  BEGIN
    ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
  EXCEPTION WHEN OTHERS THEN
    -- RLS already enabled, ignore
  END;
  
  BEGIN
    ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
  EXCEPTION WHEN OTHERS THEN
    -- RLS already enabled, ignore
  END;
  
  BEGIN
    ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
  EXCEPTION WHEN OTHERS THEN
    -- RLS already enabled, ignore
  END;
  
  BEGIN
    ALTER TABLE boss_events ENABLE ROW LEVEL SECURITY;
  EXCEPTION WHEN OTHERS THEN
    -- RLS already enabled, ignore
  END;
END $$;

-- Drop existing policies if they exist, then recreate them
-- Goals policies
DROP POLICY IF EXISTS "Users can view their own goals" ON goals;
CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own goals" ON goals;
CREATE POLICY "Users can insert their own goals"
  ON goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own goals" ON goals;
CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  USING (auth.uid() = user_id);

-- Daily tasks policies
DROP POLICY IF EXISTS "Users can view tasks for their own goals" ON daily_tasks;
CREATE POLICY "Users can view tasks for their own goals"
  ON daily_tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM goals
      WHERE goals.id = daily_tasks.goal_id
      AND goals.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert tasks for their own goals" ON daily_tasks;
CREATE POLICY "Users can insert tasks for their own goals"
  ON daily_tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM goals
      WHERE goals.id = daily_tasks.goal_id
      AND goals.user_id = auth.uid()
    )
  );

-- Check-ins policies
DROP POLICY IF EXISTS "Users can view their own check-ins" ON check_ins;
CREATE POLICY "Users can view their own check-ins"
  ON check_ins FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own check-ins" ON check_ins;
CREATE POLICY "Users can insert their own check-ins"
  ON check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own check-ins" ON check_ins;
CREATE POLICY "Users can update their own check-ins"
  ON check_ins FOR UPDATE
  USING (auth.uid() = user_id);

-- Boss events policies
DROP POLICY IF EXISTS "Users can view their own boss events" ON boss_events;
CREATE POLICY "Users can view their own boss events"
  ON boss_events FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own boss events" ON boss_events;
CREATE POLICY "Users can insert their own boss events"
  ON boss_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);


