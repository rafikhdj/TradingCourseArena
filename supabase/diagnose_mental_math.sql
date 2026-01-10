-- Diagnostic complet pour mental_math_sessions
-- Exécutez ce script dans Supabase SQL Editor pour vérifier l'état de la base

-- 1. Vérifier si la table existe
SELECT 
  '1. Table exists?' as check_type,
  EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'mental_math_sessions'
  ) as result;

-- 2. Vérifier la structure de la table
SELECT 
  '2. Table structure' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'mental_math_sessions'
ORDER BY ordinal_position;

-- 3. Vérifier si RLS est activé
SELECT 
  '3. RLS enabled?' as check_type,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'mental_math_sessions' 
  AND schemaname = 'public';

-- 4. Vérifier les policies RLS
SELECT 
  '4. RLS Policies' as check_type,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'mental_math_sessions';

-- 5. Vérifier si la fonction RPC existe
SELECT 
  '5. RPC Function exists?' as check_type,
  EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'get_mental_math_sessions'
  ) as result;

-- 6. Vérifier les permissions de la fonction
SELECT 
  '6. Function permissions' as check_type,
  routine_name,
  routine_type,
  security_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_mental_math_sessions';

-- 7. Compter les sessions existantes
SELECT 
  '7. Total sessions' as check_type,
  COUNT(*) as total_sessions,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(created_at) as oldest_session,
  MAX(created_at) as newest_session
FROM mental_math_sessions;

-- 8. Voir les dernières sessions (10 dernières)
SELECT 
  '8. Recent sessions' as check_type,
  id,
  user_id,
  duration_seconds,
  correct_count,
  total_questions,
  created_at
FROM mental_math_sessions
ORDER BY created_at DESC
LIMIT 10;

-- 9. Vérifier les users qui ont des sessions
SELECT 
  '9. Users with sessions' as check_type,
  u.id,
  u.email,
  u.display_name,
  COUNT(mms.id) as session_count
FROM users u
LEFT JOIN mental_math_sessions mms ON u.id = mms.user_id
GROUP BY u.id, u.email, u.display_name
ORDER BY session_count DESC;

-- 10. Test d'insertion (remplacez USER_ID par votre user_id)
-- Pour obtenir votre user_id :
SELECT 
  '10. Your user_id' as check_type,
  id as user_id,
  email,
  raw_user_meta_data->>'display_name' as display_name
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;

-- Pour tester l'insertion manuellement (décommentez et remplacez USER_ID) :
/*
INSERT INTO mental_math_sessions (user_id, duration_seconds, correct_count, total_questions)
VALUES ('VOTRE_USER_ID_ICI', 60, 10, 10)
RETURNING *;
*/

