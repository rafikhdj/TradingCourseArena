# Configuration d'une nouvelle base Supabase

## Étapes pour configurer votre nouvelle base de données

### 1. Récupérer les credentials Supabase

1. Allez dans votre **Supabase Dashboard**
2. Sélectionnez votre nouveau projet
3. Allez dans **Settings** → **API**
4. Copiez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon/public key** (la clé publique)

### 2. Mettre à jour app.json

Mettez à jour les credentials dans `app.json` :

```json
{
  "extra": {
    "supabaseUrl": "VOTRE_PROJECT_URL",
    "supabaseAnonKey": "VOTRE_ANON_KEY"
  }
}
```

### 3. Exécuter le schéma complet

Dans **Supabase SQL Editor**, exécutez dans l'ordre :

#### A. Schéma principal
Copiez et exécutez tout le contenu de `supabase/schema.sql`

#### B. Schéma Mental Math (optionnel, si vous voulez les stats)
Copiez et exécutez tout le contenu de `supabase/mental_math_schema.sql`

### 4. Vérifier que tout est créé

Exécutez ces requêtes pour vérifier :

```sql
-- Vérifier les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Devrait afficher :
-- leaderboard_scores
-- mental_math_attempts (si vous avez exécuté mental_math_schema.sql)
-- question_attempts
-- questions
-- users

-- Vérifier le trigger
SELECT trigger_name 
FROM information_schema.triggers
WHERE event_object_schema = 'auth' 
  AND event_object_table = 'users';

-- Devrait afficher : on_auth_user_created

-- Vérifier les policies RLS
SELECT tablename, policyname 
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 5. Désactiver la confirmation d'email (IMPORTANT)

1. **Authentication** → **Settings**
2. Désactivez **"Enable email confirmations"**
3. Sauvegardez

### 6. Tester l'inscription

1. Redémarrez l'app (si elle tourne)
2. Créez un nouveau compte
3. Vérifiez dans Supabase :
   - **Authentication** → **Users** : vous devriez voir le nouvel utilisateur
   - **Table Editor** → **users** : vous devriez voir une ligne
   - **Table Editor** → **leaderboard_scores** : vous devriez voir une ligne avec 0 points

### 7. Si vous voulez des données de test

Exécutez `supabase/seed.sql` pour ajouter des questions de test.

## Checklist complète

- [ ] Credentials mis à jour dans `app.json`
- [ ] Schéma `schema.sql` exécuté
- [ ] Schéma `mental_math_schema.sql` exécuté (optionnel)
- [ ] Trigger `on_auth_user_created` créé
- [ ] Policies RLS créées
- [ ] Confirmation d'email désactivée
- [ ] Test d'inscription réussi
- [ ] Utilisateur visible dans `auth.users`
- [ ] Utilisateur visible dans `public.users`
- [ ] Entrée créée dans `leaderboard_scores`

## Problèmes courants

### "Table already exists"
Si vous avez déjà exécuté le schéma partiellement, vous pouvez :
- Soit supprimer les tables et recommencer
- Soit utiliser `CREATE TABLE IF NOT EXISTS` (déjà dans le schéma)

### "Policy already exists"
Supprimez les policies existantes avant de les recréer :
```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### "Trigger already exists"
Le schéma utilise `CREATE OR REPLACE FUNCTION` donc ça devrait fonctionner, mais si besoin :
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

## Vérification finale

Après tout ça, testez :
1. Inscription → doit créer l'utilisateur automatiquement
2. Connexion → doit fonctionner immédiatement
3. Vérifiez dans Supabase que tout est créé

