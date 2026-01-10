-- ============================================
-- SOLUTIONS POUR RÉPARER LA TABLE questions
-- ============================================
-- Exécutez ces commandes UNE PAR UNE et testez après chaque étape

-- ============================================
-- SOLUTION 1: Réinitialiser complètement RLS
-- ============================================

-- Désactiver RLS
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;

-- Supprimer TOUTES les policies existantes
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;
DROP POLICY IF EXISTS "postgres can insert questions" ON public.questions;
DROP POLICY IF EXISTS "authenticated can insert questions" ON public.questions;
-- Ajoutez ici toutes les autres policies que vous avez créées

-- Réactiver RLS proprement
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Créer une policy SELECT publique (pour que tout le monde puisse lire)
CREATE POLICY "Anyone can view questions"
ON public.questions
FOR SELECT
USING (true);

-- Créer une policy INSERT pour authenticated
CREATE POLICY "Authenticated users can insert questions"
ON public.questions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Créer une policy INSERT pour postgres (pour SQL Editor)
CREATE POLICY "Postgres role can insert questions"
ON public.questions
FOR INSERT
TO postgres
WITH CHECK (true);

-- ============================================
-- SOLUTION 2: Vérifier et réparer les permissions
-- ============================================

-- Donner toutes les permissions à postgres
GRANT ALL ON public.questions TO postgres;
GRANT ALL ON public.questions TO authenticated;
GRANT ALL ON public.questions TO anon;

-- Donner l'usage sur la séquence si elle existe
GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- ============================================
-- SOLUTION 3: Vérifier les contraintes CHECK
-- ============================================

-- Tester chaque contrainte CHECK individuellement
-- Si une contrainte est problématique, vous pouvez la supprimer temporairement :

-- Pour tester sans la contrainte topic :
-- ALTER TABLE public.questions DROP CONSTRAINT IF EXISTS questions_topic_check;
-- Puis réinsérer :
-- ALTER TABLE public.questions ADD CONSTRAINT questions_topic_check 
--   CHECK (topic IN ('mental_math', 'probability', 'brainteaser', 'market_making'));

-- ============================================
-- SOLUTION 4: Recréer la table (DERNIER RECOURS)
-- ============================================
-- ⚠️ ATTENTION: Cela supprimera toutes les données existantes
-- Sauvegardez d'abord vos données !

/*
-- 1. Sauvegarder les données existantes
CREATE TABLE public.questions_backup AS SELECT * FROM public.questions;

-- 2. Supprimer la table
DROP TABLE IF EXISTS public.questions CASCADE;

-- 3. Recréer la table proprement
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  statement TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('mental_math', 'probability', 'brainteaser', 'market_making')),
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  type TEXT NOT NULL CHECK (type IN ('mcq', 'numeric', 'free_text')),
  choices JSONB,
  answer JSONB NOT NULL,
  explanation TEXT,
  theme TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Recréer les indexes
CREATE INDEX IF NOT EXISTS idx_questions_topic ON public.questions(topic);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON public.questions(difficulty);

-- 5. Configurer RLS proprement
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view questions"
ON public.questions
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert questions"
ON public.questions
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Postgres role can insert questions"
ON public.questions
FOR INSERT
TO postgres
WITH CHECK (true);

-- 6. Restaurer les données
INSERT INTO public.questions SELECT * FROM public.questions_backup;

-- 7. Supprimer la backup
DROP TABLE IF EXISTS public.questions_backup;
*/

-- ============================================
-- SOLUTION 5: Test d'INSERT avec transaction explicite
-- ============================================

BEGIN;

-- Test d'insert
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
  'test transaction', 
  'probability', 
  1, 
  'mcq', 
  '[]'::jsonb, 
  '"a"'::jsonb, 
  'test transaction'
)
RETURNING id, statement;

-- Si vous voyez un résultat, COMMIT, sinon ROLLBACK
-- COMMIT;
-- ROLLBACK;

-- ============================================
-- SOLUTION 6: Vérifier si c'est un problème de schéma
-- ============================================

-- S'assurer qu'on est dans le bon schéma
SET search_path TO public;

-- Vérifier le schéma actuel
SHOW search_path;

-- Essayer avec le schéma explicite
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
  'test schema explicit', 
  'probability', 
  1, 
  'mcq', 
  '[]'::jsonb, 
  '"a"'::jsonb, 
  'test'
)
RETURNING *;

