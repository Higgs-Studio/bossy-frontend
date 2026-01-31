# Phone Authentication Migration Summary

This document summarizes the changes made to convert the authentication system from email/password to phone number with OTP verification.

## Overview

The application now uses **phone number authentication with OTP (One-Time Password) verification** instead of email/password authentication. This change is powered by Supabase Auth with SMS providers like Twilio, MessageBird, or Vonage.

## Changes Made

### 1. Authentication Flow Files

#### `/app/(login)/login.tsx`
- **Changed**: Updated the login/signup form to use phone numbers instead of email
- **Added**: Two-step authentication flow (send OTP → verify OTP)
- **Added**: State management for OTP sent status
- **Features**:
  - Phone number input with E.164 format validation
  - OTP input field (6-digit code)
  - Visual feedback showing which step user is on
  - Option to change phone number after OTP is sent
  - Updated subtitles to mention phone authentication

#### `/app/(login)/actions.ts`
- **Added**: `sendOtp` action - Sends OTP code to user's phone
- **Added**: `verifyOtp` action - Verifies the OTP code and authenticates user
- **Added**: Phone number validation with Zod schema (E.164 format)
- **Added**: OTP validation (6-digit code)
- **Kept**: Old email/password functions for backward compatibility

### 2. Database and Configuration

#### `/lib/db/seed.ts`
- **Removed**: Test user creation with email/password
- **Updated**: Now only creates Stripe products
- **Note**: Users must be created through the signup flow with phone numbers

#### `/README.md`
- **Updated**: Authentication method description
- **Updated**: Setup instructions to reference phone authentication
- **Added**: Link to `PHONE_AUTH_SETUP.md` for configuration guide

### 3. Documentation

#### `/PHONE_AUTH_SETUP.md` (NEW)
Complete setup guide including:
- Supabase configuration steps
- SMS provider setup (Twilio, MessageBird, Vonage)
- Phone number format requirements
- Testing in development
- Security best practices
- Troubleshooting guide
- Cost considerations

## User Flow

### Before (Email/Password)
1. User enters email and password
2. System validates credentials
3. User is authenticated immediately

### After (Phone/OTP)
1. **Step 1**: User enters phone number with country code (e.g., +1234567890)
2. System sends 6-digit OTP code via SMS
3. **Step 2**: User enters the OTP code received on their phone
4. System verifies the code and authenticates the user

## Key Features

### Phone Number Format
- Must include country code with `+` prefix
- E.164 international format
- Examples:
  - US: `+12025551234`
  - UK: `+447700900123`
  - Singapore: `+6598765432`

### OTP Security
- 6-digit verification code
- Expires after 60 seconds (Supabase default)
- Rate limiting prevents spam
- Can request new code if needed

### User Experience
- Clear error messages for invalid phone numbers or OTP codes
- Ability to change phone number before verifying OTP
- Loading states during API calls
- Success/error feedback messages

## Required Setup Steps

Before users can authenticate with phone numbers:

1. **Configure Supabase**:
   - Enable Phone authentication in Supabase dashboard
   - Choose and configure an SMS provider

2. **Set Up SMS Provider**:
   - Create account with provider (Twilio recommended)
   - Get API credentials
   - Configure in Supabase

3. **Test the Flow**:
   - Use test phone numbers in development
   - Verify SMS delivery
   - Test OTP verification

See [PHONE_AUTH_SETUP.md](./PHONE_AUTH_SETUP.md) for detailed instructions.

## Development vs Production

### Development
- Use Twilio test phone numbers (free)
- Check Supabase logs for OTP codes
- No SMS costs during development

### Production
- Configure production SMS provider credentials
- Monitor SMS usage and costs
- Implement rate limiting
- Set up proper error handling

## Backward Compatibility

The old email/password authentication functions are still present in `actions.ts`:
- `signIn` - Email/password sign in
- `signUp` - Email/password sign up

These can be:
1. Removed if no longer needed
2. Kept for migrating existing users
3. Used as an alternative authentication method

## Translation Support

The authentication UI uses translation keys:
- `t.auth?.phone` - "Phone Number" label
- `t.auth?.enterPhone` - Phone input placeholder
- `t.auth?.phoneHint` - Format help text
- `t.auth?.otp` - "Verification Code" label
- `t.auth?.enterOtp` - OTP input placeholder
- `t.auth?.otpHint` - OTP help text
- `t.auth?.sendCode` - "Send Code" button
- `t.auth?.verifyCode` - "Verify Code" button
- `t.auth?.changePhone` - "Change phone number" link

Add these translations to support multiple languages.

## Security Considerations

1. **Phone Number Validation**: 
   - Validated on both client and server
   - Must match E.164 format

2. **Rate Limiting**:
   - Supabase provides built-in rate limiting
   - Configure limits in Supabase dashboard

3. **OTP Expiry**:
   - Codes expire after 60 seconds
   - Prevents replay attacks

4. **Session Management**:
   - Handled by Supabase Auth
   - Secure HTTP-only cookies

## Testing

### Test Sign Up
1. Go to `/sign-up`
2. Enter phone number: `+1234567890` (or your test number)
3. Click "Send Code"
4. Check phone for OTP
5. Enter OTP code
6. Should redirect to `/app/goals`

### Test Sign In
1. Go to `/sign-in`
2. Enter same phone number
3. Receive new OTP
4. Enter OTP
5. Should redirect to `/app/goals`

## Common Issues

### "Phone number must include country code"
- Make sure to include `+` and country code
- Example: `+1` for US, `+44` for UK

### "Failed to send verification code"
- Check SMS provider configuration in Supabase
- Verify API credentials
- Check SMS provider balance/status

### "Invalid verification code"
- Code may have expired (60 seconds)
- Check for typos
- Request a new code

### SMS not received
- Verify phone number format
- Check SMS provider dashboard
- Ensure number isn't blocked by carrier

## Cost Estimates

Typical SMS costs per provider:
- Twilio: ~$0.0075 per SMS (US)
- MessageBird: ~$0.01 per SMS
- Vonage: ~$0.0067 per SMS

Costs vary by country. Monitor usage to avoid surprises.

## Migration for Existing Users

If you have existing users with email/password:

1. **Option A**: Force re-registration
   - Users sign up again with phone numbers
   - Old accounts remain but can't log in

2. **Option B**: Add migration flow
   - Allow users to link phone to existing account
   - Requires custom implementation

3. **Option C**: Support both methods
   - Keep email/password alongside phone auth
   - Users choose preferred method

## Next Steps

1. Follow [PHONE_AUTH_SETUP.md](./PHONE_AUTH_SETUP.md) to configure Supabase
2. Set up an SMS provider (Twilio recommended)
3. Test the authentication flow
4. Deploy to production with proper credentials

## Questions or Issues?

- Supabase Phone Auth Docs: https://supabase.com/docs/guides/auth/phone-login
- Twilio SMS Docs: https://www.twilio.com/docs/sms
- E.164 Format: https://en.wikipedia.org/wiki/E.164
