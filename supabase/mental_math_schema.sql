-- Mental Math Attempts Table
-- This table stores individual attempts for Mental Math questions

CREATE TABLE IF NOT EXISTS mental_math_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  type TEXT NOT NULL CHECK (type IN ('integer', 'fraction', 'decimal')),
  operator TEXT NOT NULL CHECK (operator IN ('addition', 'subtraction', 'multiplication', 'division')),
  has_gap BOOLEAN NOT NULL DEFAULT false,
  time_ms INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mental_math_attempts_user_id ON mental_math_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_mental_math_attempts_created_at ON mental_math_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_mental_math_attempts_type_operator_gap ON mental_math_attempts(type, operator, has_gap);
CREATE INDEX IF NOT EXISTS idx_mental_math_attempts_user_type_operator_gap ON mental_math_attempts(user_id, type, operator, has_gap);

-- Row Level Security (RLS) Policies
ALTER TABLE mental_math_attempts ENABLE ROW LEVEL SECURITY;

-- Users can insert their own attempts
CREATE POLICY "Users can insert own mental math attempts" ON mental_math_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own attempts
CREATE POLICY "Users can view own mental math attempts" ON mental_math_attempts
  FOR SELECT USING (auth.uid() = user_id);

-- Everyone can view all attempts for platform averages (for stats comparison)
CREATE POLICY "Anyone can view mental math attempts for stats" ON mental_math_attempts
  FOR SELECT USING (true);

-- RPC Function to get Mental Math stats for a user
CREATE OR REPLACE FUNCTION get_mental_math_stats(user_id_param UUID)
RETURNS TABLE (
  type TEXT,
  operator TEXT,
  has_gap BOOLEAN,
  user_avg_time NUMERIC,
  user_avg_correct_pct NUMERIC,
  platform_avg_time NUMERIC,
  platform_avg_correct_pct NUMERIC,
  user_percent_rank NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    -- Calculate user averages per category
    SELECT
      mma.type,
      mma.operator,
      mma.has_gap,
      AVG(mma.time_ms)::NUMERIC / 1000.0 AS avg_time,
      AVG(CASE WHEN mma.is_correct THEN 100.0 ELSE 0.0 END)::NUMERIC AS avg_correct_pct,
      COUNT(*) AS attempt_count
    FROM mental_math_attempts mma
    WHERE mma.user_id = user_id_param
    GROUP BY mma.type, mma.operator, mma.has_gap
    HAVING COUNT(*) >= 1  -- Minimum attempts required
  ),
  platform_stats AS (
    -- Calculate platform averages per category
    SELECT
      mma.type,
      mma.operator,
      mma.has_gap,
      AVG(mma.time_ms)::NUMERIC / 1000.0 AS avg_time,
      AVG(CASE WHEN mma.is_correct THEN 100.0 ELSE 0.0 END)::NUMERIC AS avg_correct_pct
    FROM mental_math_attempts mma
    GROUP BY mma.type, mma.operator, mma.has_gap
  ),
  all_user_stats AS (
    -- Calculate stats for all users per category (for percent rank)
    SELECT
      mma.user_id,
      mma.type,
      mma.operator,
      mma.has_gap,
      AVG(CASE WHEN mma.is_correct THEN 100.0 ELSE 0.0 END)::NUMERIC AS avg_correct_pct,
      AVG(mma.time_ms)::NUMERIC / 1000.0 AS avg_time,
      COUNT(*) AS attempt_count
    FROM mental_math_attempts mma
    GROUP BY mma.user_id, mma.type, mma.operator, mma.has_gap
    HAVING COUNT(*) >= 5  -- Minimum 5 attempts for ranking
  ),
  user_ranks AS (
    -- Calculate percent rank for each category
    SELECT
      aus.type,
      aus.operator,
      aus.has_gap,
      aus.user_id,
      aus.avg_correct_pct,
      aus.avg_time,
      -- Percent rank: percentage of users below current user
      -- Using window function to rank by avg_correct_pct (desc), then avg_time (asc)
      CASE
        WHEN COUNT(*) OVER (PARTITION BY aus.type, aus.operator, aus.has_gap) > 1 THEN
          ((COUNT(*) FILTER (WHERE aus2.avg_correct_pct < aus.avg_correct_pct 
             OR (aus2.avg_correct_pct = aus.avg_correct_pct AND aus2.avg_time > aus.avg_time)) 
           * 100.0) / 
          NULLIF(COUNT(*) OVER (PARTITION BY aus.type, aus.operator, aus.has_gap) - 1, 0))
        ELSE 50.0  -- If only one user, set rank to 50%
      END AS percent_rank
    FROM all_user_stats aus
    LEFT JOIN all_user_stats aus2 ON 
      aus.type = aus2.type AND 
      aus.operator = aus2.operator AND 
      aus.has_gap = aus2.has_gap AND
      aus2.user_id != aus.user_id
    GROUP BY aus.type, aus.operator, aus.has_gap, aus.user_id, aus.avg_correct_pct, aus.avg_time
  )
  SELECT
    us.type,
    us.operator,
    us.has_gap,
    COALESCE(us.avg_time, 0.0),
    COALESCE(us.avg_correct_pct, 0.0),
    COALESCE(ps.avg_time, 0.0),
    COALESCE(ps.avg_correct_pct, 0.0),
    COALESCE(ur.percent_rank, 50.0)
  FROM user_stats us
  LEFT JOIN platform_stats ps ON 
    us.type = ps.type AND 
    us.operator = ps.operator AND 
    us.has_gap = ps.has_gap
  LEFT JOIN user_ranks ur ON 
    ur.type = us.type AND 
    ur.operator = us.operator AND 
    ur.has_gap = us.has_gap AND 
    ur.user_id = user_id_param
  ORDER BY us.type, us.operator, us.has_gap;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_mental_math_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_mental_math_stats(UUID) TO anon;

