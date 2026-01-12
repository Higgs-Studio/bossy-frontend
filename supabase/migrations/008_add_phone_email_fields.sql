-- Add phone_no and email fields to user_preferences if they don't exist
-- These fields are for contact information and communication preferences

-- Add phone_no column (already exists in your schema, but this ensures it)
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS phone_no TEXT;

-- Add email column (already exists in your schema, but this ensures it)
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_phone_no ON user_preferences(phone_no) WHERE phone_no IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_preferences_email ON user_preferences(email) WHERE email IS NOT NULL;

-- Add comments
COMMENT ON COLUMN user_preferences.phone_no IS 'User mobile phone number for account recovery and notifications';
COMMENT ON COLUMN user_preferences.email IS 'User email for notifications (can differ from auth email)';
