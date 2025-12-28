# How to Run Bossy Migration in Supabase

## Option 1: Run in Supabase Dashboard (Recommended)

1. **Go to your Supabase project dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste the migration**
   - Open `supabase/migrations/001_initial_bossy_schema.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the query**
   - Click "Run" or press `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)
   - Check for any errors in the results panel

## Option 2: Run Step by Step (If Option 1 Fails)

If you get errors, try running these sections one at a time:

### Step 1: Create Tables
```sql
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

CREATE TABLE IF NOT EXISTS daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  task_date DATE NOT NULL,
  task_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(goal_id, task_date)
);

CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES daily_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('done', 'missed')),
  note TEXT,
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(task_id, user_id)
);

CREATE TABLE IF NOT EXISTS boss_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('praise', 'warning', 'escalation')),
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

### Step 2: Create Indexes
```sql
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_goal_id ON daily_tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_task_date ON daily_tasks(task_date);
CREATE INDEX IF NOT EXISTS idx_check_ins_task_id ON check_ins(task_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_boss_events_user_id ON boss_events(user_id);
CREATE INDEX IF NOT EXISTS idx_boss_events_created_at ON boss_events(created_at);
```

### Step 3: Enable RLS
```sql
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE boss_events ENABLE ROW LEVEL SECURITY;
```

### Step 4: Create Policies (run all together)
Copy the policy section from the migration file (lines 64-132)

## Common Errors and Solutions

### Error: "relation already exists"
- **Solution**: The table already exists. This is OK - the migration uses `IF NOT EXISTS` so it should skip it. If you're still getting this error, the table might have been created manually. You can either:
  - Drop the table: `DROP TABLE goals CASCADE;` (be careful!)
  - Or just continue - the migration should work

### Error: "policy already exists"
- **Solution**: Run the DROP POLICY statements first, or use the simplified migration file

### Error: "permission denied"
- **Solution**: Make sure you're running this as a database admin/superuser. In Supabase Dashboard, you should have the right permissions.

### Error: "column does not exist" or "relation does not exist"
- **Solution**: Make sure you're running the migration in the correct database and schema (usually `public` schema)

## Verify Migration Worked

After running the migration, verify the tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('goals', 'daily_tasks', 'check_ins', 'boss_events');
```

You should see all 4 tables listed.

