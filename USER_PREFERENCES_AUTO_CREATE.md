# Automatic User Preferences Creation

This document explains how user preferences are automatically created when users sign up.

## Overview

When a user successfully signs up (via phone OTP or email/password), the system automatically creates a record in the `user_preferences` table. This ensures every user has their preferences set up from the start.

## Implementation

### Changes Made to `/app/(login)/actions.ts`

#### 1. Phone OTP Verification (`verifyOtp`)

After successful OTP verification:
- Checks if `user_preferences` already exist for the user
- If not, creates a new record with:
  - `user_id`: From Supabase Auth user
  - `phone_no`: The phone number used for authentication
  - `boss_type`: Default value `'execution'`
  - `boss_language`: Default value `'en'`

```typescript
// Check if user preferences already exist
const { data: existingPrefs } = await supabase
  .from('user_preferences')
  .select('id')
  .eq('user_id', userId)
  .single();

// If no preferences exist, create them
if (!existingPrefs) {
  await supabase
    .from('user_preferences')
    .insert({
      user_id: userId,
      phone_no: phone,
      boss_type: 'execution',
      boss_language: 'en',
    });
}
```

#### 2. Email/Password Sign Up (`signUp`)

After successful email sign up (when email confirmation is not required):
- Checks if `user_preferences` already exist
- If not, creates a new record with:
  - `user_id`: From Supabase Auth user
  - `email`: The email used for authentication
  - `boss_type`: Default value `'execution'`
  - `boss_language`: Default value `'en'`

#### 3. Email/Password Sign In (`signIn`)

After successful sign in:
- Checks if `user_preferences` exist
- If not, creates them with default values
- This handles users who were created before this feature was implemented

## User Preferences Table Structure

The `user_preferences` table contains:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `id` | UUID | auto | Primary key |
| `user_id` | UUID | required | References `auth.users(id)` |
| `boss_type` | TEXT | `'execution'` | Type of AI boss (execution, supportive, mentor, drill-sergeant) |
| `boss_language` | TEXT | `'en'` | Language for AI boss feedback |
| `phone_no` | TEXT | null | User's phone number |
| `email` | TEXT | null | User's email |
| `next_checkin_at` | TIMESTAMP | null | Next scheduled check-in |
| `last_checkin_at` | TIMESTAMP | null | Last check-in time |
| `stripe_customer_id` | TEXT | null | Stripe customer ID |
| `stripe_subscription_id` | TEXT | null | Stripe subscription ID |
| `stripe_product_id` | TEXT | null | Stripe product ID |
| `subscription_status` | TEXT | null | Subscription status |
| `plan_name` | TEXT | null | Plan name |
| `billing_interval` | TEXT | null | Billing interval |
| `subscription_end_date` | TIMESTAMP | null | When subscription ends |
| `created_at` | TIMESTAMP | NOW() | When record was created |
| `updated_at` | TIMESTAMP | NOW() | Last update time |

## Default Values

When a user signs up, these fields are automatically set:

### Phone Sign Up
- `user_id`: From Supabase Auth
- `phone_no`: User's phone number
- `boss_type`: `'execution'`
- `boss_language`: `'en'`
- All other fields: `null` or database defaults

### Email Sign Up
- `user_id`: From Supabase Auth
- `email`: User's email address
- `boss_type`: `'execution'`
- `boss_language`: `'en'`
- All other fields: `null` or database defaults

## Error Handling

If user preferences creation fails:
- The error is logged to console
- Authentication still succeeds
- User can use the app normally
- Preferences can be created later through other mechanisms

This graceful degradation ensures authentication issues don't block user preferences issues.

## Querying User Preferences

Use the existing query functions in `/lib/supabase/queries.ts`:

```typescript
// Get full user preferences
const prefs = await getUserPreferences(userId);

// Get specific preferences
const bossType = await getUserBossType(userId);
const bossLanguage = await getUserBossLanguage(userId);
const phoneNumber = await getUserPhone(userId);

// Update preferences
await setUserBossType(userId, 'supportive');
await setUserBossLanguage(userId, 'zh-CN');
await setUserPhone(userId, '+1234567890');
```

## Benefits

1. **Immediate Availability**: Users have preferences from signup
2. **Default Experience**: All users get the default boss experience
3. **Contact Info Storage**: Phone/email stored for later use
4. **Consistent Data**: Every user has a preferences record
5. **Future-Proof**: Ready for additional preference fields

## Database Migrations

The user_preferences table was created by:
- `004_add_user_preferences.sql` - Initial table
- `007_add_boss_language.sql` - Added boss_language field
- `008_add_phone_email_fields.sql` - Added phone_no and email fields

## Row Level Security (RLS)

The table has RLS policies ensuring:
- Users can only view their own preferences
- Users can only insert their own preferences
- Users can only update their own preferences

## Testing

### Test Phone Sign Up
1. Go to `/sign-up`
2. Enter phone number (e.g., `+1234567890`)
3. Verify OTP code
4. Check database:
```sql
SELECT * FROM user_preferences WHERE phone_no = '+1234567890';
```

### Test Email Sign Up
1. Go to `/sign-up` (if using old method)
2. Enter email and password
3. Complete signup
4. Check database:
```sql
SELECT * FROM user_preferences WHERE email = 'test@example.com';
```

### Verify Default Values
```sql
SELECT 
  user_id, 
  boss_type, 
  boss_language, 
  phone_no, 
  email, 
  created_at 
FROM user_preferences 
ORDER BY created_at DESC 
LIMIT 10;
```

## Future Enhancements

Possible additions to user preferences:
- Notification preferences
- Timezone settings
- Check-in reminder settings
- Preferred check-in times
- WhatsApp integration settings
- Custom boss personality traits

## Related Files

- `/app/(login)/actions.ts` - Authentication logic
- `/lib/supabase/queries.ts` - Query functions
- `/supabase/migrations/004_add_user_preferences.sql` - Initial migration
- `/supabase/migrations/007_add_boss_language.sql` - Boss language
- `/supabase/migrations/008_add_phone_email_fields.sql` - Contact fields

## Summary

All authentication flows now automatically create user_preferences records, ensuring every user has their settings initialized from the start. This provides a consistent experience and makes the app ready for future preference-based features.
