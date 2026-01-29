# Migration 009: Add Task Status

## Overview
This migration adds a `status` column to the `daily_tasks` table to track task progress (todo, in_progress, done).

## What Changed

### Database Changes
- Added `status` column to `daily_tasks` table
- Status values: `'todo'`, `'in_progress'`, `'done'`
- Default value: `'todo'`
- Added index on status for better query performance

### Code Changes

#### TypeScript Types (`lib/supabase/queries.ts`)
- Updated `DailyTask` type to include `status` field

#### Goals Page (`app/app/goals/goals-list-content.tsx`)
- Changed default filter from `'all'` to `'active'` - now shows active goals by default

#### Edit Goal Page (`app/app/goals/[id]/page.tsx`)
- Added goal title display next to "Edit Goal" heading
- Shows "Edit Goal: [Goal Title]" format

#### Edit Goal Form (`app/app/goals/[id]/edit-goal-form.tsx`)
- Added intensity icons to each intensity option:
  - 🔥 Flame icon for High intensity (red)
  - 📈 TrendingUp icon for Medium intensity (yellow)
  - 📉 TrendingDown icon for Low intensity (green)
- Updated border colors to match intensity levels

#### Task List (`app/app/goals/[id]/task-list.tsx`)
- Added task status badges with colors:
  - **To Do**: Gray/slate color with Circle icon
  - **In Progress**: Yellow/amber color with Clock icon
  - **Done**: Green color with CheckCircle icon
- Added clickable status badges - click to cycle through statuses (todo → in progress → done → todo)
- Added task completion progress bar in header showing percentage complete
- Progress calculation: (completed tasks / total tasks) × 100%

#### Actions (`app/app/goals/[id]/actions.ts`)
- Added `updateTaskStatusAction` to update task status
- Handles optimistic updates and revalidation

## How to Apply Migration

### Option 1: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open `supabase/migrations/009_add_task_status.sql`
4. Copy the contents and paste into SQL Editor
5. Click "Run" to execute

### Option 2: Supabase CLI
```bash
supabase db push
```

## Migration SQL

```sql
-- Add status column to daily_tasks table
ALTER TABLE daily_tasks
ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done'));

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_daily_tasks_status ON daily_tasks(status);
```

## Verification

After running the migration, verify:

1. **Database**: Check that the `status` column exists on `daily_tasks` table
   ```sql
   SELECT column_name, data_type, column_default 
   FROM information_schema.columns 
   WHERE table_name = 'daily_tasks' AND column_name = 'status';
   ```

2. **Existing Data**: All existing tasks should have status = 'todo' by default

3. **Frontend Features**:
   - Goals page shows active goals by default
   - Task status badges appear on each task
   - Clicking task status badge cycles through statuses
   - Task completion percentage shows in task list header
   - Edit Goal page shows goal title in heading
   - Intensity options show appropriate icons

## Rollback (if needed)

If you need to rollback this migration:

```sql
-- Remove the status column
ALTER TABLE daily_tasks DROP COLUMN IF EXISTS status;

-- Remove the index
DROP INDEX IF EXISTS idx_daily_tasks_status;
```

## Notes

- All existing tasks will default to `'todo'` status
- The status field is required (NOT NULL) with a CHECK constraint
- Task status updates use optimistic UI updates for better UX
- Progress calculation updates in real-time as task statuses change
