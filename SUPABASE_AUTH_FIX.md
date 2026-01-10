# Fix: Problème de connexion après inscription

## Problème
Après l'inscription, l'utilisateur reçoit "invalid credentials" lors de la connexion.

## Causes possibles

### 1. Confirmation d'email activée (le plus probable)
Si la confirmation d'email est activée dans Supabase :
- L'utilisateur s'inscrit avec succès
- Mais son compte n'est pas confirmé (`email_confirmed_at` est `null`)
- Quand il essaie de se connecter, Supabase refuse car l'email n'est pas vérifié

### 2. Mot de passe incorrect
L'utilisateur a peut-être fait une erreur de frappe.

### 3. Problème de session
La session n'est pas correctement créée après l'inscription.

## Solutions

### Solution 1: Désactiver la confirmation d'email (Recommandé pour le développement)

1. Allez dans **Supabase Dashboard** → **Authentication** → **Settings**
2. Trouvez **"Email Auth"** ou **"Email Confirmation"**
3. **Désactivez** "Enable email confirmations"
4. Sauvegardez

**Résultat** : Les utilisateurs seront automatiquement connectés après l'inscription.

### Solution 2: Vérifier les logs Supabase

1. Allez dans **Supabase Dashboard** → **Logs** → **Auth Logs**
2. Regardez les erreurs lors de la connexion
3. Cherchez des messages comme :
   - "Email not confirmed"
   - "Invalid login credentials"
   - "User not found"

### Solution 3: Tester avec un utilisateur existant

Dans Supabase SQL Editor, vérifiez si l'utilisateur existe :

```sql
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'votre-email@example.com';
```

Si `email_confirmed_at` est `NULL`, l'email n'est pas confirmé.

### Solution 4: Confirmer manuellement l'email (pour tester)

Dans Supabase SQL Editor :

```sql
-- Confirmer l'email manuellement
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'votre-email@example.com';
```

Puis essayez de vous connecter à nouveau.

## Améliorations apportées au code

1. **SignInScreen** : Messages d'erreur plus clairs
   - Détecte si c'est un problème de confirmation d'email
   - Donne des instructions spécifiques

2. **SignUpScreen** : Meilleure gestion après inscription
   - Détecte si l'utilisateur est automatiquement connecté
   - Affiche le bon message selon le cas

3. **useAuth** : Logs de debug ajoutés
   - Affiche dans la console si l'email est confirmé
   - Aide à diagnostiquer le problème

## Test

1. Désactivez la confirmation d'email dans Supabase
2. Inscrivez-vous avec un nouvel email
3. Vous devriez être automatiquement connecté
4. Si vous vous déconnectez et reconnectez, ça devrait fonctionner

## Si le problème persiste

1. Vérifiez les logs dans la console de l'app (React Native Debugger)
2. Vérifiez les logs Supabase (Dashboard → Logs)
3. Testez avec un compte que vous avez créé directement dans Supabase Dashboard
4. Vérifiez que le mot de passe est correct (essayez de le réinitialiser)

