-- Créer la table mental_math_sessions si elle n'existe pas
-- Exécutez ce script dans Supabase SQL Editor

-- Vérifier si la table existe déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'mental_math_sessions'
  ) THEN
    -- Créer la table
    CREATE TABLE mental_math_sessions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      duration_seconds INTEGER NOT NULL CHECK (duration_seconds IN (60, 120, 180)),
      correct_count INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Créer les indexes
    CREATE INDEX idx_mental_math_sessions_user_id ON mental_math_sessions(user_id);
    CREATE INDEX idx_mental_math_sessions_created_at ON mental_math_sessions(created_at);
    CREATE INDEX idx_mental_math_sessions_user_duration ON mental_math_sessions(user_id, duration_seconds);
    CREATE INDEX idx_mental_math_sessions_user_created ON mental_math_sessions(user_id, created_at DESC);

    -- Activer RLS
    ALTER TABLE mental_math_sessions ENABLE ROW LEVEL SECURITY;

    -- Créer les policies
    CREATE POLICY "Users can insert own mental math sessions" ON mental_math_sessions
      FOR INSERT WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "Users can view own mental math sessions" ON mental_math_sessions
      FOR SELECT USING (auth.uid() = user_id);

    RAISE NOTICE 'Table mental_math_sessions created successfully';
  ELSE
    RAISE NOTICE 'Table mental_math_sessions already exists';
  END IF;
END $$;

-- Vérifier que la table existe
SELECT 
  'Table exists: ' || EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'mental_math_sessions'
  ) as table_status;

-- Vérifier les policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'mental_math_sessions';

-- Test d'insertion (remplacez USER_ID par votre user_id)
-- SELECT auth.uid() as current_user_id; -- Pour obtenir votre user_id
-- INSERT INTO mental_math_sessions (user_id, duration_seconds, correct_count, total_questions)
-- VALUES (auth.uid(), 60, 10, 10)
-- RETURNING *;

