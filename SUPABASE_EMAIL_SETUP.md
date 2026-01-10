# Configuration Email Supabase

## Problème
Par défaut, Supabase envoie un email de confirmation lors de l'inscription. Si vous ne recevez pas cet email, c'est probablement parce que :
1. La configuration SMTP n'est pas configurée dans Supabase
2. Les emails sont bloqués par votre fournisseur d'email
3. Les emails vont dans les spams

## Solution pour le Développement : Désactiver la Confirmation d'Email

### Étapes dans Supabase Dashboard :

1. **Allez dans votre projet Supabase**
   - Ouvrez https://supabase.com/dashboard
   - Sélectionnez votre projet

2. **Accédez aux paramètres d'authentification**
   - Menu de gauche : **Authentication** → **Settings** (ou **Settings** → **Auth**)

3. **Désactivez la confirmation d'email**
   - Trouvez la section **"Email Auth"** ou **"Email Confirmation"**
   - Désactivez l'option **"Enable email confirmations"** ou **"Confirm email"**
   - Sauvegardez les changements

4. **Alternative : Désactiver uniquement pour le développement**
   - Vous pouvez aussi configurer des **"Redirect URLs"** pour le développement local
   - Ajoutez `http://localhost:3000` ou votre URL locale dans les **"Site URL"** et **"Redirect URLs"**

### Après avoir désactivé la confirmation :
- Les nouveaux utilisateurs pourront se connecter immédiatement après l'inscription
- Aucun email de confirmation ne sera envoyé
- L'utilisateur sera automatiquement confirmé

## Solution pour la Production : Configurer SMTP

Si vous voulez activer les emails de confirmation en production :

1. **Dans Supabase Dashboard** :
   - **Settings** → **Auth** → **SMTP Settings**
   - Configurez votre service SMTP (Gmail, SendGrid, Mailgun, etc.)
   - Entrez les informations SMTP :
     - Host
     - Port
     - Username
     - Password
     - From email address

2. **Services SMTP recommandés** :
   - **SendGrid** (gratuit jusqu'à 100 emails/jour)
   - **Mailgun** (gratuit jusqu'à 1000 emails/mois)
   - **Gmail SMTP** (nécessite un mot de passe d'application)

## Vérification

Après avoir désactivé la confirmation d'email :
1. Créez un nouveau compte
2. Vous devriez pouvoir vous connecter immédiatement sans vérifier l'email
3. L'utilisateur sera automatiquement confirmé

## Note Importante

⚠️ **Pour la production**, il est recommandé de :
- Activer la confirmation d'email
- Configurer SMTP correctement
- Utiliser un service d'email professionnel

Pour le développement local, la désactivation de la confirmation est la solution la plus simple.

