-- Add boss_type column to goals table
ALTER TABLE goals ADD COLUMN IF NOT EXISTS boss_type TEXT NOT NULL DEFAULT 'execution';

-- Add check constraint for valid boss types
ALTER TABLE goals ADD CONSTRAINT valid_boss_type CHECK (boss_type IN ('execution', 'supportive', 'mentor', 'drill-sergeant'));


