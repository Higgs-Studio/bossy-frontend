-- Cleanup: Remove old SaaS starter tables
-- This migration removes the old team-based tables that are no longer needed
-- WARNING: This will delete all data in these tables!
-- Only run this if you're sure you don't need the old data

-- Drop tables in correct order (respecting foreign key constraints)
-- CASCADE will automatically drop dependent objects (constraints, indexes, etc.)

DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS invitations CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Note: This does NOT drop auth.users (Supabase's built-in auth table)
-- We're only dropping the custom 'users' table from the old schema
-- Supabase's auth.users is managed by Supabase and should never be dropped

