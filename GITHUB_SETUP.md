# Guide pour connecter le projet à GitHub

## ✅ Étape 1 : Votre code est déjà commité !

Le commit initial a été créé avec tous vos fichiers, y compris `CONVERSATION_SUMMARY.md`.

## 📝 Étape 2 : Créer un dépôt sur GitHub

1. Allez sur [GitHub.com](https://github.com) et connectez-vous
2. Cliquez sur le bouton **"+"** en haut à droite → **"New repository"**
3. Remplissez les informations :
   - **Repository name** : `TradingCourseArena` (ou le nom que vous voulez)
   - **Description** : `Application d'entraînement aux mathématiques mentales et questions quantitatives`
   - **Visibility** : Choisissez Public ou Private
   - ⚠️ **NE COCHEZ PAS** "Initialize this repository with a README" (vous avez déjà des fichiers)
4. Cliquez sur **"Create repository"**

## 🔗 Étape 3 : Connecter votre projet local à GitHub

Après avoir créé le dépôt, GitHub vous affichera une page avec les instructions. Utilisez la section **"push an existing repository from the command line"**.

Exécutez ces commandes dans votre terminal (remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub) :

```bash
cd /Users/rafikhadjadj/Documents/projet/TradingCourseArena

# Ajouter le remote GitHub
git remote add origin https://github.com/VOTRE_USERNAME/TradingCourseArena.git

# Renommer la branche principale en "main" si ce n'est pas déjà fait
git branch -M main

# Pousser votre code vers GitHub
git push -u origin main
```

**Note** : Si vous utilisez SSH au lieu de HTTPS, utilisez :
```bash
git remote add origin git@github.com:VOTRE_USERNAME/TradingCourseArena.git
```

## 🔐 Étape 4 : Authentification (si nécessaire)

Si GitHub vous demande de vous authentifier :

- **HTTPS** : GitHub vous demandera probablement un Personal Access Token au lieu d'un mot de passe
  - Créez un token : Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token
  - Scopes nécessaires : `repo` (accès complet aux dépôts)

- **SSH** : Si vous utilisez SSH, assurez-vous que votre clé SSH est configurée :
  ```bash
  ssh -T git@github.com
  ```

## ✅ Vérification

Après le push, rafraîchissez la page GitHub de votre dépôt. Vous devriez voir tous vos fichiers, y compris `CONVERSATION_SUMMARY.md` !

## 📌 Commandes utiles pour la suite

```bash
# Voir les remotes configurés
git remote -v

# Pousser vos futurs commits
git push

# Récupérer les changements de GitHub
git pull

# Voir l'état de votre dépôt
git status
```

## 🔒 Fichiers sensibles à protéger

Assurez-vous que votre `.gitignore` exclut bien :
- `.env` et `.env.local` (variables d'environnement avec vos clés Supabase)
- `.expo/` (fichiers temporaires Expo)

Ces fichiers ne doivent **JAMAIS** être commités sur GitHub !

---

**Vous avez des questions ?** Consultez `CONVERSATION_SUMMARY.md` pour retrouver les solutions aux problèmes passés.

