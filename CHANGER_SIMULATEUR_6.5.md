# 📱 Changer vers iPhone 6.5 pouces dans le Simulateur

## 🎯 Objectif

Changer du iPhone 17 Pro vers un iPhone 6.5 pouces (requis pour App Store Connect).

## ✅ Solution : Changer de Device dans le Simulateur

### Méthode 1 : Via le Menu du Simulateur

1. **Dans le simulateur iOS** (fenêtre ouverte)
2. **Menu** → **Device** → **Manage Devices...**
3. **Ou directement** : **Device** → Cherchez un iPhone 6.5 pouces :
   - **iPhone 11 Pro Max** ✅ (6.5 pouces - 1242 x 2688)
   - **iPhone XS Max** ✅ (6.5 pouces - 1242 x 2688)

4. **Sélectionnez** l'iPhone 6.5 pouces
5. Le simulateur va redémarrer avec le bon iPhone

### Méthode 2 : Via Xcode

1. **Ouvrez Xcode**
2. **Xcode** → **Open Developer Tool** → **Simulator**
3. **Device** → **Manage Devices...**
4. **Sélectionnez** un iPhone 6.5 pouces :
   - iPhone 11 Pro Max
   - iPhone XS Max
5. **Fermez** l'ancien simulateur si nécessaire

### Méthode 3 : Via la Ligne de Commande

Fermez le simulateur actuel, puis :

```bash
# Fermer tous les simulateurs
xcrun simctl shutdown all

# Ouvrir iPhone 11 Pro Max (6.5 pouces)
xcrun simctl boot "iPhone 11 Pro Max"

# Ouvrir le simulateur
open -a Simulator
```

## 📐 Dimensions iPhone 6.5 pouces

- **iPhone 11 Pro Max** : 1242 x 2688 pixels ✅
- **iPhone XS Max** : 1242 x 2688 pixels ✅

Ces dimensions correspondent exactement aux exigences App Store Connect.

## 🚀 Après le Changement

Une fois le bon iPhone sélectionné :

1. **Relancez Expo** :
   ```bash
   npm run ios
   ```

2. **Ou connectez-vous manuellement** si Expo Go est déjà installé

3. **Faites vos captures** avec ⌘ + S

## 📸 Captures d'Écran

Avec iPhone 6.5 pouces, vos captures seront automatiquement :
- **1242 x 2688 pixels**
- **Format correct** pour App Store Connect
- **Prêtes à uploader** sans modification

## 🔍 Vérifier les Simulateurs Disponibles

Pour voir tous les simulateurs disponibles :

```bash
xcrun simctl list devices available | grep -i "iphone.*pro max"
```

---

**Astuce :** iPhone 11 Pro Max est le plus courant et fonctionne parfaitement pour les captures App Store ! 📸
