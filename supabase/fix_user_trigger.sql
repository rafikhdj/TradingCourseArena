-- ============================================
-- FIX : Réparer le trigger de création d'utilisateur
-- ============================================

-- 1. Supprimer l'ancien trigger s'il existe
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Supprimer l'ancienne fonction s'elle existe
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Recréer la fonction avec les bonnes permissions
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insérer dans public.users
  INSERT INTO public.users (id, display_name)
  VALUES (
    NEW.id, 
    COALESCE(
      NEW.raw_user_meta_data->>'display_name', 
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING; -- Éviter les erreurs si l'utilisateur existe déjà
  
  -- Insérer dans leaderboard_scores
  INSERT INTO public.leaderboard_scores (user_id, points)
  VALUES (NEW.id, 0)
  ON CONFLICT (user_id) DO NOTHING; -- Éviter les erreurs si l'entrée existe déjà
  
  RETURN NEW;
END;
$$;

-- 4. Donner les permissions nécessaires
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;

-- 5. Recréer le trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Vérifier que le trigger est créé
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

-- 7. Si vous avez déjà des utilisateurs dans auth.users mais pas dans public.users,
--    créez-les manuellement :
INSERT INTO public.users (id, display_name)
SELECT 
  au.id,
  COALESCE(
    au.raw_user_meta_data->>'display_name',
    split_part(au.email, '@', 1)
  ) AS display_name
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- 8. Créer les entrées leaderboard pour les utilisateurs existants
INSERT INTO public.leaderboard_scores (user_id, points)
SELECT 
  au.id,
  0
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.leaderboard_scores ls WHERE ls.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;

-- 9. Vérifier le résultat
SELECT 
  COUNT(*) AS total_auth_users,
  (SELECT COUNT(*) FROM public.users) AS total_public_users,
  (SELECT COUNT(*) FROM public.leaderboard_scores) AS total_leaderboard_entries
FROM auth.users;

