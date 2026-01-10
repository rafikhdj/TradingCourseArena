-- TradingCourseArena Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  statement TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('mental_math', 'probability', 'brainteaser', 'derivatives')),
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  type TEXT NOT NULL CHECK (type IN ('mcq', 'numeric', 'free_text')),
  choices JSONB,
  answer JSONB NOT NULL,
  explanation TEXT,
  theme TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Question attempts table
CREATE TABLE IF NOT EXISTS question_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  answer_given TEXT NOT NULL,
  time_spent_ms INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboard scores table
CREATE TABLE IF NOT EXISTS leaderboard_scores (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_question_attempts_user_id ON question_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_question_id ON question_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_question_attempts_created_at ON question_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_leaderboard_scores_points ON leaderboard_scores(points DESC);

-- RPC function to increment leaderboard points (optional, for atomic updates)
CREATE OR REPLACE FUNCTION increment_leaderboard_points(
  user_id_param UUID,
  points_to_add INTEGER
)
RETURNS VOID
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO leaderboard_scores (user_id, points, last_updated)
  VALUES (user_id_param, points_to_add, NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    points = leaderboard_scores.points + points_to_add,
    last_updated = NOW();
END;
$$;

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_scores ENABLE ROW LEVEL SECURITY;

-- Users: Users can read all, but only update their own
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Questions: Everyone can read, authenticated users and postgres can insert
CREATE POLICY "Anyone can view questions" ON questions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert questions" ON questions
  FOR INSERT
  WITH CHECK (true);

-- Question attempts: Users can insert their own, view their own
CREATE POLICY "Users can insert own attempts" ON question_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own attempts" ON question_attempts
  FOR SELECT USING (auth.uid() = user_id);

-- Leaderboard: Everyone can read
CREATE POLICY "Anyone can view leaderboard" ON leaderboard_scores
  FOR SELECT USING (true);

-- Grant execute permission for RPC function
GRANT EXECUTE ON FUNCTION increment_leaderboard_points(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_leaderboard_points(UUID, INTEGER) TO anon;

-- Trigger to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into public.users
  INSERT INTO public.users (id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data->>'display_name', 
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Insert into leaderboard_scores
  INSERT INTO public.leaderboard_scores (user_id, points)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

