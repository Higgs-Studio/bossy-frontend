-- Add update and delete policies for daily_tasks table
-- This enables users to edit and delete tasks for their own goals

-- Update policy for daily_tasks
DROP POLICY IF EXISTS "Users can update tasks for their own goals" ON daily_tasks;
CREATE POLICY "Users can update tasks for their own goals"
  ON daily_tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM goals
      WHERE goals.id = daily_tasks.goal_id
      AND goals.user_id = auth.uid()
    )
  );

-- Delete policy for daily_tasks
DROP POLICY IF EXISTS "Users can delete tasks for their own goals" ON daily_tasks;
CREATE POLICY "Users can delete tasks for their own goals"
  ON daily_tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM goals
      WHERE goals.id = daily_tasks.goal_id
      AND goals.user_id = auth.uid()
    )
  );

