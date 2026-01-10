-- ============================================
-- FIX: Ajouter la policy INSERT pour questions
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor

-- Vérifier les policies actuelles
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

-- Supprimer l'ancienne policy INSERT si elle existe (pour éviter les doublons)
DROP POLICY IF EXISTS "Anyone can insert questions" ON questions;
DROP POLICY IF EXISTS "Postgres can insert questions" ON questions;
DROP POLICY IF EXISTS "Authenticated can insert questions" ON questions;

-- Créer une policy INSERT publique (pour que tout le monde puisse insérer)
CREATE POLICY "Anyone can insert questions" ON questions
  FOR INSERT
  WITH CHECK (true);

-- Alternative: Si vous voulez seulement que postgres et authenticated puissent insérer
-- CREATE POLICY "Postgres and authenticated can insert questions" ON questions
--   FOR INSERT
--   TO postgres, authenticated
--   WITH CHECK (true);

-- Vérifier que RLS est activé
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'questions' AND schemaname = 'public';

-- Si RLS n'est pas activé, l'activer
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Test d'insertion
INSERT INTO questions (
  statement, 
  topic, 
  difficulty, 
  type, 
  choices, 
  answer, 
  explanation, 
  theme
) VALUES (
  'Test question', 
  'probability', 
  1, 
  'mcq',
  '[{"id":"a","label":"0.5"}]'::jsonb,
  '"a"'::jsonb,
  'Test explanation',
  'prob_basic'
) RETURNING id, statement, theme;

-- Vérifier que la ligne a été insérée
SELECT COUNT(*) FROM questions WHERE statement = 'Test question';

