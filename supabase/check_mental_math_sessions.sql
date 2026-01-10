-- Vérifier si la table mental_math_sessions existe
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'mental_math_sessions' 
  AND table_schema = 'public';

-- Vérifier la structure de la table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'mental_math_sessions'
ORDER BY ordinal_position;

-- Vérifier les policies RLS
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'mental_math_sessions';

-- Vérifier si RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'mental_math_sessions' 
  AND schemaname = 'public';

-- Vérifier les sessions existantes
SELECT 
  id,
  user_id,
  duration_seconds,
  correct_count,
  total_questions,
  created_at
FROM mental_math_sessions
ORDER BY created_at DESC
LIMIT 10;

-- Compter les sessions par utilisateur
SELECT 
  user_id,
  duration_seconds,
  COUNT(*) as session_count,
  AVG(correct_count) as avg_correct
FROM mental_math_sessions
GROUP BY user_id, duration_seconds
ORDER BY user_id, duration_seconds;

