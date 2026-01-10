-- Test et vérification de mental_math_sessions
-- Exécutez ce script dans Supabase SQL Editor

-- 1. Vérifier si la table existe
SELECT 
  'Table exists' as check_type,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'mental_math_sessions'
  ) as result;

-- 2. Vérifier la structure
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'mental_math_sessions'
ORDER BY ordinal_position;

-- 3. Vérifier RLS
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'mental_math_sessions' 
  AND schemaname = 'public';

-- 4. Vérifier les policies
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

-- 5. Compter les sessions existantes
SELECT 
  COUNT(*) as total_sessions,
  COUNT(DISTINCT user_id) as unique_users
FROM mental_math_sessions;

-- 6. Voir les dernières sessions
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

-- 7. Test d'insertion manuel (remplacez USER_ID par votre user_id)
-- Pour obtenir votre user_id :
-- SELECT id, email FROM auth.users LIMIT 1;
-- 
-- Puis testez :
-- INSERT INTO mental_math_sessions (user_id, duration_seconds, correct_count, total_questions)
-- VALUES ('VOTRE_USER_ID', 60, 10, 10)
-- RETURNING *;

