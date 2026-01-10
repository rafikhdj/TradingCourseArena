-- ============================================
-- DIAGNOSTIC COMPLET POUR LA TABLE questions
-- ============================================

-- 1. Vérifier que c'est bien une TABLE et pas une VUE
SELECT 
  table_type,
  table_schema,
  table_name
FROM information_schema.tables 
WHERE table_name = 'questions' AND table_schema = 'public';

-- 2. Vérifier toutes les contraintes (CHECK, FK, etc.)
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.questions'::regclass
ORDER BY contype, conname;

-- 3. Vérifier les indexes (parfois un index cassé peut bloquer)
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'questions' AND schemaname = 'public';

-- 4. Vérifier les permissions au niveau de la table
SELECT 
  grantee,
  privilege_type,
  is_grantable
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'questions';

-- 5. Vérifier les RLS policies (même si désactivé, voir ce qui existe)
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'questions' AND schemaname = 'public';

-- 6. Vérifier si RLS est vraiment désactivé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'questions' AND schemaname = 'public';

-- 7. Vérifier les triggers (même si vous avez dit qu'il n'y en a pas)
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'public' AND event_object_table = 'questions';

-- 8. Vérifier les dépendances (FK vers d'autres tables)
SELECT
  tc.table_schema, 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name,
  ccu.table_schema AS foreign_table_schema,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'questions'
  AND tc.table_schema = 'public';

-- 9. Vérifier s'il y a des règles (rules) sur la table
SELECT 
  rulename,
  ev_type,
  ev_enabled,
  definition
FROM pg_rules
WHERE tablename = 'questions' AND schemaname = 'public';

-- 10. Vérifier le propriétaire de la table
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables
WHERE tablename = 'questions' AND schemaname = 'public';

-- 11. TEST D'INSERT AVEC DIAGNOSTIC
-- D'abord, vérifier le nombre de lignes avant
SELECT COUNT(*) AS count_before FROM public.questions;

-- Essayer un INSERT avec RETURNING pour voir si ça retourne quelque chose
INSERT INTO public.questions (
  statement, 
  topic, 
  difficulty, 
  type, 
  choices, 
  answer, 
  explanation
)
VALUES (
  'test diagnostic', 
  'probability', 
  1, 
  'mcq', 
  '[]'::jsonb, 
  '"a"'::jsonb, 
  'test'
)
RETURNING id, statement, created_at;

-- Vérifier le nombre de lignes après
SELECT COUNT(*) AS count_after FROM public.questions;

-- 12. Vérifier les logs d'erreur récents (si accessible)
-- Note: Dans Supabase, vous devrez peut-être vérifier les logs dans le dashboard

-- 13. Vérifier si uuid_generate_v4() fonctionne
SELECT uuid_generate_v4() AS test_uuid;

-- 14. Vérifier les valeurs par défaut de la table
SELECT 
  column_name,
  column_default,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'questions'
ORDER BY ordinal_position;

