-- Add status column to daily_tasks table
ALTER TABLE daily_tasks
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done'));

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_daily_tasks_status ON daily_tasks(status);
