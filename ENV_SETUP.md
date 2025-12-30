# Environment Variables Setup

## Required Supabase Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase API Keys
# Use the NEW publishable key (recommended) or fallback to anon key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxx
# OR (for backward compatibility during transition)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Service role key (ONLY for server-side operations that need to bypass RLS)
# NEVER expose this in client-side code!
SUPABASE_SERVICE_ROLE_KEY=sb_secret_xxxxx
# OR (for backward compatibility)
# SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Getting Your API Keys

### Option 1: New Publishable/Secret Keys (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API Keys**
3. If you don't have a publishable key, click **"Create new API Keys"**
4. Copy the **Publishable key** (starts with `sb_publishable_...`)
5. For server-side operations that need elevated access, copy the **Secret key** (starts with `sb_secret_...`)

### Option 2: Legacy Keys (Still Supported)

1. Go to your Supabase Dashboard
2. Navigate to **Settings** → **API Keys** → **Legacy API Keys** tab
3. Copy the `anon` key (for client-side)
4. Copy the `service_role` key (for server-side, use with caution)

## Which Key to Use?

### For Client-Side (Browser) Code
- ✅ **Publishable key** (`sb_publishable_...`) - Recommended
- ✅ **Anon key** (JWT-based) - Still works, but not recommended for new projects

### For Server-Side Code (Respecting RLS)
- ✅ **Publishable key** (`sb_publishable_...`) - Recommended
- ✅ **Anon key** (JWT-based) - Still works

### For Server-Side Code (Bypassing RLS - Admin Operations)
- ⚠️ **Secret key** (`sb_secret_...`) - Use only when absolutely necessary
- ⚠️ **Service role key** (JWT-based) - Use only when absolutely necessary
- **NEVER expose these in client-side code!**

## Why Use New Keys?

According to [Supabase documentation](https://supabase.com/docs/guides/api/api-keys), the new publishable and secret keys offer:

1. **Better Security**: Independent rotation without downtime
2. **No Forced Upgrades**: Mobile apps won't break if you rotate keys
3. **Better Practices**: No 10-year expiry, easier to manage
4. **Production Ready**: Designed for modern applications

## Security Notes

- ✅ **Publishable key**: Safe to expose in client-side code (browser, mobile apps)
- ❌ **Secret key**: NEVER expose in client-side code, only use in secure server environments
- ✅ Both old and new keys work during the transition period
- ✅ The code supports both naming conventions for backward compatibility

## Current Implementation

The Bossy codebase supports both:
- New keys: `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Legacy keys: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (fallback)

This ensures zero downtime during migration.


