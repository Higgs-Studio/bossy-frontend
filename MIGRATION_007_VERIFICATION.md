# Migration 007: boss_language Column Verification

## Issue
The `boss_language` column may not exist in the `user_preferences` table, causing boss language saves to fail silently.

## Migration File
The migration file exists at: `supabase/migrations/007_add_boss_language.sql`

## How to Verify and Apply

### Option 1: Check via Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** > `user_preferences` table
3. Check if `boss_language` column exists
4. If missing, go to **SQL Editor** and run the migration file

### Option 2: Run Migration via SQL Editor
1. Open Supabase Dashboard > **SQL Editor**
2. Copy the contents of `supabase/migrations/007_add_boss_language.sql`
3. Paste and run the SQL

### Option 3: Check via SQL Query
Run this query in SQL Editor to check if column exists:
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'user_preferences' 
  AND column_name = 'boss_language';
```

If the query returns no rows, the column doesn't exist and the migration needs to be applied.

## Expected Result
After applying the migration, the `user_preferences` table should have:
- `boss_language` column (TEXT, NOT NULL, DEFAULT 'en')
- Check constraint: `boss_language IN ('en', 'zh-CN', 'zh-TW', 'zh-HK')`
- Index: `idx_user_preferences_boss_language`

## Code Impact
Once the column exists, the code in `app/app/boss/actions.ts` (line 63) will successfully save `boss_language` values.
