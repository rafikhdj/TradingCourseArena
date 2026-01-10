# Troubleshooting: Table questions - INSERT ne fonctionne pas

## Problème
Les INSERT dans la table `questions` retournent "Success. No rows returned" mais aucune ligne n'est insérée, même avec RLS désactivé.

## Diagnostic étape par étape

### Étape 1: Exécuter le script de diagnostic

Dans Supabase SQL Editor, exécutez :
```sql
-- Copier/coller le contenu de diagnose_questions_table.sql
```

Cela va vous donner toutes les informations sur :
- Le type de l'objet (table vs vue)
- Les contraintes
- Les permissions
- Les policies RLS
- Les triggers
- Les dépendances

### Étape 2: Vérifications spécifiques

#### A. Vérifier que c'est bien une TABLE
```sql
SELECT table_type 
FROM information_schema.tables 
WHERE table_name = 'questions' AND table_schema = 'public';
```
**Résultat attendu**: `BASE TABLE` (pas `VIEW`)

#### B. Vérifier les RULES (souvent oubliées)
```sql
SELECT rulename, ev_type, definition
FROM pg_rules
WHERE tablename = 'questions' AND schemaname = 'public';
```
**Si des règles existent**, elles peuvent intercepter les INSERT. Supprimez-les si nécessaire.

#### C. Vérifier les permissions
```sql
SELECT grantee, privilege_type
FROM information_schema.table_privileges
WHERE table_schema = 'public' AND table_name = 'questions';
```
**Vérifiez** que `postgres` et `authenticated` ont les permissions `INSERT`.

### Étape 3: Solutions à essayer (dans l'ordre)

#### Solution 1: Réinitialiser RLS (le plus probable)
```sql
-- Désactiver RLS
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les policies
DROP POLICY IF EXISTS "Anyone can view questions" ON public.questions;
DROP POLICY IF EXISTS "postgres can insert questions" ON public.questions;
-- ... supprimez toutes les autres policies

-- Réactiver RLS
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Recréer les policies proprement
CREATE POLICY "Anyone can view questions"
ON public.questions FOR SELECT USING (true);

CREATE POLICY "Postgres can insert"
ON public.questions FOR INSERT TO postgres WITH CHECK (true);
```

#### Solution 2: Vérifier les permissions
```sql
GRANT ALL ON public.questions TO postgres;
GRANT ALL ON public.questions TO authenticated;
```

#### Solution 3: Test avec transaction explicite
```sql
BEGIN;
INSERT INTO public.questions (statement, topic, difficulty, type, answer)
VALUES ('test', 'probability', 1, 'mcq', '"a"'::jsonb)
RETURNING *;
COMMIT;
```

#### Solution 4: Vérifier les RULES
Si des règles existent, elles peuvent bloquer les INSERT :
```sql
-- Voir les règles
SELECT * FROM pg_rules WHERE tablename = 'questions';

-- Supprimer une règle si nécessaire
DROP RULE IF EXISTS rule_name ON public.questions;
```

#### Solution 5: Vérifier les contraintes CHECK
Testez chaque contrainte individuellement :
```sql
-- Test 1: topic
SELECT 'probability'::text IN ('mental_math', 'probability', 'brainteaser', 'market_making');

-- Test 2: difficulty
SELECT 1 >= 1 AND 1 <= 5;

-- Test 3: type
SELECT 'mcq'::text IN ('mcq', 'numeric', 'free_text');
```

#### Solution 6: Recréer la table (dernier recours)
⚠️ **Sauvegardez d'abord vos données !**

```sql
-- 1. Backup
CREATE TABLE questions_backup AS SELECT * FROM questions;

-- 2. Supprimer et recréer
DROP TABLE questions CASCADE;
-- Puis recréer avec votre script original
```

### Étape 4: Causes possibles spécifiques à Supabase

#### A. Problème de transaction dans SQL Editor
Le SQL Editor de Supabase peut parfois avoir des problèmes de transaction. Essayez :
- Utiliser `BEGIN; ... COMMIT;` explicitement
- Exécuter les commandes une par une au lieu d'un script complet

#### B. Problème de cache Supabase
Parfois Supabase cache les métadonnées. Essayez :
- Attendre quelques minutes
- Rafraîchir la page du dashboard
- Vérifier dans une autre session

#### C. Problème de schéma search_path
```sql
-- Vérifier
SHOW search_path;

-- Forcer
SET search_path TO public;
```

### Étape 5: Test final

Après chaque solution, testez avec :
```sql
-- Test simple
INSERT INTO public.questions (
  statement, topic, difficulty, type, answer
) VALUES (
  'test final', 'probability', 1, 'mcq', '"a"'::jsonb
) RETURNING id, statement, created_at;

-- Vérifier
SELECT COUNT(*) FROM public.questions WHERE statement = 'test final';
```

## Solution la plus probable

Dans 90% des cas, c'est un problème de **RLS policies mal configurées** ou **conflit entre plusieurs policies**. 

La solution la plus efficace :
1. Désactiver RLS
2. Supprimer TOUTES les policies
3. Réactiver RLS
4. Recréer les policies une par une
5. Tester après chaque policy

## Si rien ne fonctionne

1. Vérifiez les **logs Supabase** dans le dashboard (section Logs)
2. Contactez le support Supabase avec :
   - Le résultat du script de diagnostic
   - Les logs d'erreur
   - La version de votre projet Supabase

## Notes importantes

- Les INSERT dans Supabase SQL Editor utilisent le rôle `postgres` par défaut
- Assurez-vous que les policies incluent `TO postgres` ou `TO PUBLIC`
- Les contraintes CHECK peuvent parfois causer des rollbacks silencieux
- Les RULES sont souvent oubliées mais peuvent bloquer les INSERT

