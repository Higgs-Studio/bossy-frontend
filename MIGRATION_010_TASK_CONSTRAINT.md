# Migration 010: Remove Task Date Unique Constraint

## Issue
The database has a unique constraint `UNIQUE(goal_id, task_date)` on the `daily_tasks` table that prevents creating multiple tasks for the same goal on the same date. This causes the error:

```
Failed to create task: duplicate key value violates unique constraint "daily_tasks_goal_id_task_date_key"
```

## Solution
Migration `010_remove_unique_task_date_constraint.sql` has been created to remove this constraint, allowing users to create multiple tasks per day for the same goal.

## How to Apply

### For Local Development
```bash
# Make sure Docker Desktop is running
npx supabase db reset --local
# OR if you want to just push the new migration
npx supabase db push
```

### For Production (Supabase Cloud)
```bash
npx supabase db push
```

## What Changed
- Removed `UNIQUE(goal_id, task_date)` constraint from `daily_tasks` table
- Users can now create multiple tasks for the same goal on the same date
