-- Add boss_language field to user_preferences
-- This allows users to choose their boss's language separately from the app language

-- Add the boss_language column with default 'en'
ALTER TABLE user_preferences 
ADD COLUMN IF NOT EXISTS boss_language TEXT NOT NULL DEFAULT 'en' 
CHECK (boss_language IN ('en', 'zh-CN', 'zh-TW', 'zh-HK'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_boss_language ON user_preferences(boss_language);

-- Add comment
COMMENT ON COLUMN user_preferences.boss_language IS 'The language the AI boss uses for feedback (can differ from app language)';
