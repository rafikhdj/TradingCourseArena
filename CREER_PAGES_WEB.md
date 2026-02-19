# 🌐 Créer les Pages Web Requises pour App Store Connect

## 📋 Pages Nécessaires

Pour soumettre votre app sur l'App Store, vous avez besoin de :

1. **URL du Site Web** (obligatoire)
2. **URL de la Politique de Confidentialité** (obligatoire)
3. **URL de Support** (recommandé)

## 🚀 Option 1 : GitHub Pages (Gratuit et Rapide)

### Étape 1 : Créer un Nouveau Repository

1. Allez sur : https://github.com/new
2. Créez un nouveau repo : `tradingcoursearena-website`
3. Cochez **"Public"** (pour GitHub Pages gratuit)
4. Cliquez sur **"Create repository"**

### Étape 2 : Créer les Fichiers

Créez ces fichiers dans votre nouveau repo :

**`index.html`** (Page principale) :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TradingCourseArena - Entraînement pour Traders</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 { color: #0A0E27; }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #0A0E27;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>TradingCourseArena</h1>
    <h2>Entraînement pour Traders Juniors</h2>
    
    <p>TradingCourseArena est l'application d'entraînement ultime pour les traders juniors qui se préparent aux entretiens et aux défis du trading en temps réel.</p>
    
    <h3>Fonctionnalités</h3>
    <ul>
        <li>Quiz infini avec questions aléatoires</li>
        <li>Calcul mental rapide</li>
        <li>Probabilités et brainteasers</li>
        <li>Statistiques détaillées</li>
        <li>Leaderboard global</li>
    </ul>
    
    <a href="https://apps.apple.com/app/tradingcoursearena" class="button">Télécharger sur l'App Store</a>
    
    <h3>Contact</h3>
    <p>Email : [votre-email@example.com]</p>
    
    <p><a href="/privacy.html">Politique de Confidentialité</a></p>
</body>
</html>
```

**`privacy.html`** (Politique de confidentialité) :
```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Politique de Confidentialité - TradingCourseArena</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 { color: #0A0E27; }
    </style>
</head>
<body>
    <h1>Politique de Confidentialité - TradingCourseArena</h1>
    <p><em>Dernière mise à jour : 15 janvier 2026</em></p>
    
    <h2>Collecte de Données</h2>
    <p>TradingCourseArena collecte uniquement les données nécessaires au fonctionnement de l'application :</p>
    <ul>
        <li>Informations de compte (email, mot de passe crypté)</li>
        <li>Données de progression (scores, statistiques)</li>
        <li>Données d'utilisation (temps passé, questions répondues)</li>
    </ul>
    
    <h2>Utilisation des Données</h2>
    <p>Vos données sont utilisées uniquement pour améliorer votre expérience utilisateur et suivre votre progression.</p>
    
    <h2>Stockage des Données</h2>
    <p>Toutes les données sont stockées de manière sécurisée sur Supabase (infrastructure cloud sécurisée).</p>
    
    <h2>Partage des Données</h2>
    <p>Nous ne partageons pas vos données personnelles avec des tiers.</p>
    
    <h2>Vos Droits</h2>
    <p>Vous pouvez à tout moment accéder à vos données, les modifier ou supprimer votre compte.</p>
    
    <h2>Contact</h2>
    <p>Pour toute question : [votre-email@example.com]</p>
    
    <p><a href="/index.html">← Retour à l'accueil</a></p>
</body>
</html>
```

### Étape 3 : Activer GitHub Pages

1. Dans votre repo GitHub, allez dans **Settings** → **Pages**
2. Sous **Source**, sélectionnez **"main"** (ou "master")
3. Cliquez sur **"Save"**
4. Votre site sera disponible à : `https://[votre-username].github.io/tradingcoursearena-website`

### Étape 4 : URLs à Utiliser

- **URL du Site Web** : `https://[votre-username].github.io/tradingcoursearena-website`
- **URL de la Politique de Confidentialité** : `https://[votre-username].github.io/tradingcoursearena-website/privacy.html`
- **URL de Support** : `https://[votre-username].github.io/tradingcoursearena-website` (ou votre email)

## 🚀 Option 2 : Netlify (Gratuit et Simple)

1. Allez sur : https://www.netlify.com
2. Créez un compte (gratuit)
3. Créez un nouveau site
4. Glissez-déposez un dossier avec vos fichiers HTML
5. Votre site sera disponible à : `https://[nom-du-site].netlify.app`

## 🚀 Option 3 : Utiliser le Repo Existant

Si vous préférez, vous pouvez ajouter ces fichiers dans votre repo existant `TradingCourseArena` :

1. Créez un dossier `docs/` ou `website/`
2. Ajoutez les fichiers HTML
3. Activez GitHub Pages sur ce dossier
4. URLs : `https://rafikhdj.github.io/TradingCourseArena/website/`

## ✅ Checklist

- [ ] Créer le repository ou le dossier
- [ ] Créer `index.html`
- [ ] Créer `privacy.html`
- [ ] Activer GitHub Pages / Netlify
- [ ] Tester les URLs
- [ ] Mettre à jour les emails dans les fichiers
- [ ] Utiliser les URLs dans App Store Connect

## 📝 Notes

- Les URLs GitHub Pages peuvent prendre quelques minutes à être actives
- Vous pouvez utiliser un nom de domaine personnalisé plus tard
- Les pages peuvent être très simples - l'important est qu'elles existent et soient accessibles

---

**Une fois les pages créées, vous pourrez remplir toutes les informations dans App Store Connect !** 🎉
