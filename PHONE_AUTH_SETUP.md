# Phone Authentication Setup Guide

This application now uses phone number authentication instead of email/password. Follow these steps to configure Supabase for phone authentication.

## Supabase Configuration

### 1. Enable Phone Authentication

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** > **Providers**
3. Enable the **Phone** provider
4. Configure your SMS provider (Twilio, MessageBird, Vonage, etc.)

### 2. Configure SMS Provider

You'll need to set up one of the following SMS providers:

#### Option A: Twilio (Recommended)
1. Sign up for a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number or use a trial number
4. In Supabase, enter your Twilio credentials:
   - Account SID
   - Auth Token
   - Sender Phone Number

#### Option B: MessageBird
1. Sign up at https://messagebird.com
2. Get your API key
3. Configure in Supabase Authentication settings

#### Option C: Vonage (formerly Nexmo)
1. Sign up at https://www.vonage.com
2. Get your API key and secret
3. Configure in Supabase Authentication settings

### 3. SMS Template Configuration

In Supabase Authentication settings, customize your SMS template:

```
Your verification code is: {{ .Token }}
```

### 4. Rate Limiting

Configure rate limiting to prevent abuse:
- Go to **Authentication** > **Rate Limits**
- Set appropriate limits for SMS sends per hour/day
- Recommended: 5 SMS per hour per phone number

### 5. Phone Number Format

The application expects phone numbers in E.164 format:
- Must start with `+` followed by country code
- Examples:
  - US: `+12025551234`
  - UK: `+447700900123`
  - Singapore: `+6598765432`

## Testing in Development

### Using Test Phone Numbers (Twilio)

1. In Twilio Console, add verified test phone numbers
2. These numbers can receive OTP codes without incurring SMS costs
3. Useful for development and testing

### Supabase Test Mode

For local development without SMS costs:
1. Set up Supabase in development mode
2. Check Supabase logs for OTP codes during development
3. OTP codes may be logged in the Supabase dashboard under **Logs**

## Environment Variables

Ensure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## User Flow

1. **Sign Up / Sign In**: User enters phone number with country code
2. **OTP Sent**: System sends 6-digit verification code via SMS
3. **Verification**: User enters the code
4. **Authentication**: System verifies code and creates/logs in user

## Security Best Practices

1. **Rate Limiting**: Implement rate limiting to prevent SMS spam
2. **Phone Validation**: Validate phone numbers on the client and server
3. **OTP Expiry**: OTP codes expire after 60 seconds (default in Supabase)
4. **Max Attempts**: Limit verification attempts to prevent brute force

## Troubleshooting

### SMS Not Received
- Check phone number format (must include country code with +)
- Verify SMS provider credentials in Supabase
- Check SMS provider dashboard for delivery status
- Ensure phone number is not blocked by carrier

### Invalid OTP Error
- OTP codes expire after 60 seconds
- Check for typos in the code
- Request a new code if expired

### Authentication Fails
- Verify Supabase URL and anon key in environment variables
- Check Supabase logs for detailed error messages
- Ensure phone provider is properly configured

## Migration from Email Auth

If migrating from email authentication:

1. Existing users will need to re-register with phone numbers
2. Old email/password authentication is kept in `actions.ts` for backward compatibility
3. Consider implementing a migration flow for existing users
4. Update user communication about the change

## Cost Considerations

- SMS costs vary by provider and country
- Typical costs: $0.01 - $0.05 per SMS
- Use test numbers during development
- Monitor usage in SMS provider dashboard
- Consider implementing phone number verification only for new signups

## Support

For issues with:
- Supabase configuration: https://supabase.com/docs/guides/auth/phone-login
- Twilio setup: https://www.twilio.com/docs
- Phone number formats: https://en.wikipedia.org/wiki/E.164
