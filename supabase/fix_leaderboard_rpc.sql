-- Fix leaderboard RPC function to work with RLS
-- Exécutez ce script dans Supabase SQL Editor

-- Supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS increment_leaderboard_points(UUID, INTEGER);

-- Recréer la fonction avec SECURITY DEFINER pour bypass RLS
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_leaderboard_points(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_leaderboard_points(UUID, INTEGER) TO anon;

-- Vérifier que la fonction existe
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'increment_leaderboard_points';

