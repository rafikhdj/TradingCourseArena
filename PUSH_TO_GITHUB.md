# Instructions pour pousser vers GitHub

## ✅ Le remote est déjà configuré

Votre dépôt local est connecté à : `https://github.com/rafikhdj/TradingCourseArena.git`

## 🔑 Étape 1 : Créer un Personal Access Token

1. Allez sur : https://github.com/settings/tokens
2. Cliquez sur **"Generate new token"** → **"Generate new token (classic)"**
3. Donnez un nom : `TradingCourseArena Push`
4. Sélectionnez l'expiration (ex: 90 jours)
5. ✅ Cochez **`repo`** (Full control of private repositories)
6. Cliquez sur **"Generate token"**
7. **COPIEZ LE TOKEN** (vous ne le reverrez plus !) - Il ressemble à `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 🚀 Étape 2 : Pousser le code

**Option A : Via le terminal (recommandé)**

Ouvrez un terminal dans votre projet et exécutez :

```bash
cd /Users/rafikhadjadj/Documents/projet/TradingCourseArena

# Pousser vers GitHub (Git vous demandera username et password)
git push -u origin main
```

**Quand Git vous demande :**
- **Username** : `rafikhdj`
- **Password** : Collez votre Personal Access Token (pas votre mot de passe GitHub !)

**Option B : Avec le token dans l'URL (temporaire)**

Si l'option A ne fonctionne pas, vous pouvez utiliser le token directement dans la commande :

```bash
git push https://ghp_VOTRE_TOKEN@github.com/rafikhdj/TradingCourseArena.git main
```

(Remplacez `VOTRE_TOKEN` par le token que vous avez créé)

⚠️ **Note** : Cette méthode expose le token dans l'historique bash. Utilisez `history -c` après pour nettoyer.

## ✅ Vérification

Après le push, allez sur https://github.com/rafikhdj/TradingCourseArena et vous devriez voir tous vos fichiers !

## 🔐 Sécurité

- Ne partagez jamais votre token
- Ne commitez jamais votre token dans le code
- Le token sera stocké dans votre keychain macOS (osxkeychain)
- Vous pouvez révoquer le token à tout moment sur GitHub

