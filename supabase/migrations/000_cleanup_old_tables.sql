-- Optional: Cleanup script for old SaaS starter tables
-- Only run this if you want to remove the old team-based tables
-- WARNING: This will delete all data in these tables!

-- Drop tables in correct order (respecting foreign key constraints)
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Note: This does NOT drop auth.users (Supabase's built-in auth table)
-- We're only dropping the custom 'users' table from the old schema

