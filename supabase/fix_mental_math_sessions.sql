-- Script complet pour créer/réparer la table mental_math_sessions
-- Exécutez ce script dans Supabase SQL Editor

-- 1. Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Users can insert own mental math sessions" ON mental_math_sessions;
DROP POLICY IF EXISTS "Users can view own mental math sessions" ON mental_math_sessions;

-- 2. Créer la table si elle n'existe pas
CREATE TABLE IF NOT EXISTS mental_math_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds IN (60, 120, 180)),
  correct_count INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer les indexes
CREATE INDEX IF NOT EXISTS idx_mental_math_sessions_user_id ON mental_math_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_mental_math_sessions_created_at ON mental_math_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_mental_math_sessions_user_duration ON mental_math_sessions(user_id, duration_seconds);
CREATE INDEX IF NOT EXISTS idx_mental_math_sessions_user_created ON mental_math_sessions(user_id, created_at DESC);

-- 4. Activer RLS
ALTER TABLE mental_math_sessions ENABLE ROW LEVEL SECURITY;

-- 5. Créer les policies (IMPORTANT: avec TO authenticated et TO anon)
CREATE POLICY "Users can insert own mental math sessions" ON mental_math_sessions
  FOR INSERT 
  TO authenticated, anon
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own mental math sessions" ON mental_math_sessions
  FOR SELECT 
  TO authenticated, anon
  USING (auth.uid() = user_id);

-- 6. Donner les permissions nécessaires
GRANT ALL ON mental_math_sessions TO authenticated;
GRANT ALL ON mental_math_sessions TO anon;

-- 7. Vérifier que tout est créé
SELECT 
  'Table exists' as status,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'mental_math_sessions'
  ) as table_exists;

SELECT 
  'Policies' as status,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'mental_math_sessions';

-- 8. Vérifier RLS
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'mental_math_sessions' 
  AND schemaname = 'public';

