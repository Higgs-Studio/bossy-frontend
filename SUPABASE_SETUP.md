# Bossy Supabase Setup Guide

## Important: Don't Run Old Seed Scripts

**DO NOT run `pnpm db:seed`** - that's for the old SaaS starter and will cause errors.

## Step 0: Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
```

**Getting your keys:**
- Go to Supabase Dashboard → Settings → API Keys
- Use the **new publishable key** (`sb_publishable_...`) - recommended
- Or use the legacy `anon` key from the "Legacy API Keys" tab (still works)

See `ENV_SETUP.md` for detailed instructions on API keys.

## Step 1: Run the Bossy Migration

1. Go to your Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_bossy_schema.sql`
3. Paste and run it

## Step 2: Configure Email Confirmation (Important!)

For development, you may want to disable email confirmation so users can sign up and immediately use the app:

1. Go to Supabase Dashboard → Authentication → Settings
2. Under "Email Auth", find "Enable email confirmations"
3. **For development**: Turn this OFF (users can sign up immediately)
4. **For production**: Keep this ON (users must confirm email)

Alternatively, you can manually confirm users:
- Go to Authentication → Users
- Find the user and click "Confirm user"

## Step 3: Create a Test User (via Supabase Auth)

Instead of using the old seed script, create users through Supabase Auth:

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user" → "Create new user"
3. Enter:
   - Email: `test@test.com`
   - Password: `admin123`
   - Auto Confirm User: ✅ (check this)

Or use the sign-up page in your app at `/sign-up`

## Step 4: Verify Tables Were Created

Run this in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('goals', 'daily_tasks', 'check_ins', 'boss_events');
```

You should see all 4 tables.

## That's It!

Your Bossy app is now ready. The old `users`, `teams`, etc. tables can stay (they won't interfere), or you can remove them later if you want.

