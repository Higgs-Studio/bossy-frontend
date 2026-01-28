-- Remove unique constraint on (goal_id, task_date) to allow multiple tasks per day
-- This allows users to create multiple tasks for the same goal on the same date

-- Drop the existing unique constraint
ALTER TABLE daily_tasks 
DROP CONSTRAINT IF EXISTS daily_tasks_goal_id_task_date_key;
