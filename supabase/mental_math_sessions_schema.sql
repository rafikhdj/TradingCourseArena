-- Mental Math Sessions Table
-- This table stores session summaries (one row per game played)
-- Each session records: duration, number of correct answers, and timestamp

CREATE TABLE IF NOT EXISTS mental_math_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds IN (60, 120, 180)),
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mental_math_sessions_user_id ON mental_math_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mental_math_sessions_created_at ON mental_math_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_mental_math_sessions_user_duration ON mental_math_sessions(user_id, duration_seconds);
CREATE INDEX IF NOT EXISTS idx_mental_math_sessions_user_created ON mental_math_sessions(user_id, created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE mental_math_sessions ENABLE ROW LEVEL SECURITY;

-- Users can insert their own sessions
CREATE POLICY "Users can insert own mental math sessions" ON mental_math_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own sessions
CREATE POLICY "Users can view own mental math sessions" ON mental_math_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- Function to get Mental Math session history for a user
CREATE OR REPLACE FUNCTION get_mental_math_sessions(user_id_param UUID)
RETURNS TABLE (
  id UUID,
  duration_seconds INTEGER,
  correct_count INTEGER,
  total_questions INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mms.id,
    mms.duration_seconds,
    mms.correct_count,
    mms.total_questions,
    mms.created_at
  FROM mental_math_sessions mms
  WHERE mms.user_id = user_id_param
  ORDER BY mms.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_mental_math_sessions(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_mental_math_sessions(UUID) TO anon;

