# Cleanup Old Tables - Instructions

## What This Does

Removes the old SaaS starter tables that are no longer needed:
- `users` (custom table - we use Supabase's `auth.users` now)
- `teams`
- `team_members`
- `activity_logs`
- `invitations`

**⚠️ WARNING: This will DELETE ALL DATA in these tables!**

## How to Run

### Option 1: Run in Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/002_cleanup_old_tables.sql`
3. Copy the entire contents
4. Paste into SQL Editor
5. Click "Run"

### Option 2: Run After Bossy Migration

If you want to do everything in one go:

1. First run: `001_initial_bossy_schema.sql` (creates new tables)
2. Then run: `002_cleanup_old_tables.sql` (removes old tables)

## Verify Cleanup

After running, verify the old tables are gone:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'teams', 'team_members', 'activity_logs', 'invitations');
```

This should return 0 rows (tables don't exist).

## What Stays

- ✅ `auth.users` - Supabase's built-in auth table (NEVER drop this!)
- ✅ `goals` - New Bossy table
- ✅ `daily_tasks` - New Bossy table
- ✅ `check_ins` - New Bossy table
- ✅ `boss_events` - New Bossy table

## When to Run This

- ✅ You've confirmed the Bossy migration works
- ✅ You don't need any data from the old tables
- ✅ You want a clean database

If you're unsure, you can keep the old tables - they won't interfere with Bossy.



