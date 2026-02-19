# 📸 Créer des Captures d'Écran pour App Store Connect

## ✅ Utiliser le Simulateur iOS

Le simulateur iOS est parfait pour créer des captures d'écran aux bonnes dimensions !

## 🚀 Étapes

### 1. Lancer l'App dans le Simulateur

```bash
npm run ios
```

Ou si vous avez déjà Expo qui tourne :
- Appuyez sur `i` dans le terminal Expo
- Ou sélectionnez "Open on iOS simulator"

### 2. Choisir le Bon iPhone (6.5 pouces)

Dans le simulateur iOS :

1. **Menu** → **Device** → **Manage Devices...**
2. Ou directement : **Device** → **iPhone 11 Pro Max** (6.5 pouces)
   - Ou **iPhone 14 Pro Max** (6.7 pouces)
   - Ou **iPhone 15 Pro Max** (6.7 pouces)

**Pour iPhone 6.5" (requis) :**
- **iPhone 11 Pro Max** : 1242 x 2688 pixels ✅
- **iPhone XS Max** : 1242 x 2688 pixels ✅

**Pour iPhone 6.7" (optionnel mais recommandé) :**
- **iPhone 14 Pro Max** : 1290 x 2796 pixels
- **iPhone 15 Pro Max** : 1290 x 2796 pixels

### 3. Naviguer dans l'App

Ouvrez les écrans que vous voulez capturer :
- **Home** (quiz infini)
- **Training** (sélection de topics)
- **Profile** (statistiques)
- **Leaderboard** (si accessible)
- **Quiz en cours** (question active)

### 4. Faire les Captures d'Écran

**Méthode 1 : Commande Mac**
- Appuyez sur **⌘ + S** dans le simulateur
- Les captures sont sauvegardées sur le Bureau

**Méthode 2 : Menu Simulateur**
- **Device** → **Screenshot** → **Save Screenshot**
- Ou **File** → **Save Screen**

**Méthode 3 : Capture d'écran Mac**
- **⌘ + Shift + 4** puis sélectionnez la fenêtre du simulateur

### 5. Vérifier les Dimensions

Les captures du simulateur sont déjà aux bonnes dimensions :
- **iPhone 11 Pro Max** : 1242 x 2688 pixels ✅
- **iPhone 14 Pro Max** : 1290 x 2796 pixels ✅

## 📐 Dimensions Requises pour App Store Connect

### iPhone 6.5" (Obligatoire)
- **Format** : 1242 x 2688 pixels
- **Simulateur** : iPhone 11 Pro Max ou iPhone XS Max

### iPhone 6.7" (Recommandé)
- **Format** : 1290 x 2796 pixels
- **Simulateur** : iPhone 14 Pro Max ou iPhone 15 Pro Max

### iPhone 5.5" (Optionnel)
- **Format** : 1242 x 2208 pixels
- **Simulateur** : iPhone 8 Plus

### iPad Pro 12.9" (Optionnel)
- **Format** : 2048 x 2732 pixels
- **Simulateur** : iPad Pro 12.9"

## 🎨 Conseils pour de Bonnes Captures

1. **Utilisez des données réalistes** :
   - Connectez-vous avec un compte de test
   - Répondez à quelques questions
   - Ayez des statistiques visibles

2. **Évitez les informations sensibles** :
   - Pas d'emails réels
   - Pas de noms personnels
   - Utilisez des données de test

3. **Montrez les meilleures fonctionnalités** :
   - Quiz infini avec question visible
   - Statistiques et progression
   - Interface moderne et claire

4. **Ordre recommandé** :
   1. Home (quiz infini) - Écran principal
   2. Question en cours avec réponse
   3. Profile avec statistiques
   4. Training/Selection de topics
   5. Leaderboard (si disponible)

## 🔧 Si les Captures ne Fonctionnent Pas

### Problème : Format incorrect

**Solution :** Utilisez le simulateur avec les bonnes dimensions :
```bash
# Forcer un iPhone spécifique
npx expo start --ios --device "iPhone 11 Pro Max"
```

### Problème : Taille incorrecte

**Solution :** Vérifiez les dimensions avec :
- Ouvrez l'image dans Preview (Mac)
- **Tools** → **Show Inspector** (⌘ + I)
- Vérifiez les dimensions en pixels

### Problème : Qualité médiocre

**Solution :** 
- Utilisez **⌘ + S** dans le simulateur (meilleure qualité)
- Évitez les captures d'écran Mac de la fenêtre

## 📝 Checklist

- [ ] Simulateur iOS lancé avec iPhone 6.5" (11 Pro Max)
- [ ] App ouverte et fonctionnelle
- [ ] Données de test visibles
- [ ] Au moins 1 capture d'écran (jusqu'à 10)
- [ ] Dimensions vérifiées : 1242 x 2688 pixels
- [ ] Captures sauvegardées
- [ ] Prêtes à uploader dans App Store Connect

## 🚀 Upload dans App Store Connect

1. Allez dans **App Store Connect** → Votre App → **App Store** → **Version iOS**
2. Section **Screenshots**
3. Sélectionnez **iPhone 6.5" Display**
4. Glissez-déposez vos captures (ou cliquez sur **+**)
5. Répétez pour les autres tailles si nécessaire

---

**Astuce :** Le simulateur iOS est la méthode la plus fiable pour créer des captures d'écran aux bonnes dimensions ! 📸
