-- Update topic constraint to replace 'market_making' with 'derivatives'
-- Run this in Supabase SQL Editor

-- First, update existing questions (if any)
UPDATE questions 
SET topic = 'derivatives' 
WHERE topic = 'market_making';

-- Drop and recreate the constraint
ALTER TABLE questions 
DROP CONSTRAINT IF EXISTS questions_topic_check;

ALTER TABLE questions 
ADD CONSTRAINT questions_topic_check 
CHECK (topic IN ('mental_math', 'probability', 'brainteaser', 'derivatives'));

