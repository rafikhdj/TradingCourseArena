-- ============================================
-- DIAGNOSTIC : Vérifier la création d'utilisateurs
-- ============================================

-- 1. Vérifier si des utilisateurs existent dans auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 2. Vérifier si des utilisateurs existent dans public.users
SELECT 
  id,
  display_name,
  created_at
FROM public.users
ORDER BY created_at DESC
LIMIT 10;

-- 3. Vérifier si le trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users'
  AND trigger_name = 'on_auth_user_created';

-- 4. Vérifier si la fonction existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'handle_new_user';

-- 5. Vérifier les permissions de la fonction
SELECT 
  p.proname AS function_name,
  pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
  AND p.proname = 'handle_new_user';

-- 6. Comparer les utilisateurs (auth.users vs public.users)
SELECT 
  au.id AS auth_user_id,
  au.email,
  au.created_at AS auth_created_at,
  pu.id AS public_user_id,
  pu.display_name,
  pu.created_at AS public_created_at,
  CASE 
    WHEN pu.id IS NULL THEN '❌ Manquant dans public.users'
    ELSE '✅ Présent'
  END AS status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC
LIMIT 10;

