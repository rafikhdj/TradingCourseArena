-- Fix leaderboard RPC function and check for duplicate sessions
-- Exécutez ce script dans Supabase SQL Editor

-- 1. Fix la fonction RPC pour qu'elle fonctionne avec RLS
DROP FUNCTION IF EXISTS increment_leaderboard_points(UUID, INTEGER);

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

-- Grant permissions
GRANT EXECUTE ON FUNCTION increment_leaderboard_points(UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_leaderboard_points(UUID, INTEGER) TO anon;

-- 2. Vérifier les sessions en double (même user_id, duration_seconds, created_at très proche)
SELECT 
  user_id,
  duration_seconds,
  created_at,
  COUNT(*) as duplicate_count
FROM mental_math_sessions
GROUP BY user_id, duration_seconds, created_at
HAVING COUNT(*) > 1;

-- 3. Supprimer les doublons (garder seulement la première session)
-- ATTENTION: Ne faites ça que si vous voulez nettoyer les doublons existants
/*
WITH duplicates AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, duration_seconds, 
      DATE_TRUNC('second', created_at)
      ORDER BY created_at
    ) as rn
  FROM mental_math_sessions
)
DELETE FROM mental_math_sessions
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);
*/

-- 4. Vérifier que tout fonctionne
SELECT 
  'Function exists' as status,
  EXISTS (
    SELECT 1 FROM information_schema.routines
    WHERE routine_schema = 'public'
    AND routine_name = 'increment_leaderboard_points'
  ) as function_exists;

