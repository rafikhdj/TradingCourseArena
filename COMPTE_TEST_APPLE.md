# 🔐 Créer un Compte de Test pour Apple Review

## ✅ Bonne Nouvelle

Votre app **accepte n'importe quel email valide**, pas seulement Gmail ! 

Le code vérifie seulement que l'email n'est pas vide, mais n'impose pas de format spécifique. Supabase accepte tous les formats d'email valides.

## 🎯 Options pour le Compte de Test

### Option 1 : Utiliser un Email Gmail (Plus Simple)

Si vous préférez utiliser Gmail pour le compte de test :

**Créer un compte Gmail de test :**
1. Créez un nouveau compte Gmail : `tradingcoursearena.test@gmail.com`
2. Ou utilisez un alias : `votre-email+applereview@gmail.com` (Gmail ignore la partie après `+`)

**Informations à fournir à Apple :**
- **Nom d'utilisateur** : `tradingcoursearena.test@gmail.com`
- **Mot de passe** : `AppleReview2026!`

### Option 2 : Utiliser un Email Personnalisé (Fonctionne Aussi)

Vous pouvez utiliser n'importe quel email valide :

**Exemples qui fonctionnent :**
- `apple.review@tradingcoursearena.com` (si vous avez ce domaine)
- `test.apple@example.com`
- `reviewer@test.com`
- N'importe quel email valide

**Important :** Si vous utilisez un email personnalisé, assurez-vous que :
- L'email existe et peut recevoir des emails (si confirmation requise)
- OU que la confirmation d'email est désactivée dans Supabase

### Option 3 : Créer le Compte Directement via Supabase

Si vous préférez créer le compte sans passer par l'app :

1. **Allez sur votre dashboard Supabase**
2. **Authentication** → **Users** → **Add User**
3. **Remplissez** :
   - **Email** : `apple.review.test@gmail.com` (ou n'importe quel email)
   - **Password** : `AppleReview2026!`
   - **Auto Confirm User** : ✅ Cochez cette case (important !)
4. **Cliquez sur "Create User"**

Ensuite :
- Connectez-vous dans l'app avec ces identifiants
- Répondez à quelques questions pour créer des données de test
- Fournissez ces identifiants à Apple

## 📝 Recommandation

**Je recommande l'Option 1 (Gmail)** car :
- ✅ Plus simple à créer
- ✅ Pas de problème de confirmation d'email
- ✅ Facile à retenir pour Apple
- ✅ Vous pouvez créer un compte Gmail dédié

**Exemple :**
- **Email** : `tradingcoursearena.apple@gmail.com`
- **Mot de passe** : `AppleReview2026!`

## ✅ Checklist Avant de Fournir à Apple

- [ ] Le compte se connecte correctement dans l'app
- [ ] Toutes les fonctionnalités sont accessibles
- [ ] Il y a des données de test (questions répondues, statistiques)
- [ ] Le profil est complet
- [ ] Aucune erreur ne bloque l'utilisation
- [ ] Pas de 2FA obligatoire
- [ ] Pas de confirmation d'email obligatoire (ou email vérifié)

## 📧 Informations Finales pour Apple

Dans App Store Connect, section "Informations utiles à la vérification de l'app" :

**Nom d'utilisateur :**
```
tradingcoursearena.apple@gmail.com
```

**Mot de passe :**
```
AppleReview2026!
```

**Notes optionnelles :**
```
Test Account Information:
- Email: tradingcoursearena.apple@gmail.com
- Password: AppleReview2026!

The app is fully functional. You can:
- Answer questions in the infinite quiz (Home tab)
- View statistics in the Profile tab
- Check the leaderboard
- All features are accessible without restrictions.
```

---

**En résumé :** Utilisez un email Gmail pour plus de simplicité, mais n'importe quel email valide fonctionnera ! 🎉
