# 🔧 Corriger l'Erreur de Timeout du Simulateur

## ❌ Problème

```
Operation timed out
Simulator device failed to open exp://192.168.1.109:8081
```

Le simulateur s'ouvre mais ne peut pas se connecter à Expo.

## ✅ Solutions

### Solution 1 : Attendre que le Simulateur soit Complètement Prêt

Le simulateur vient d'être installé et peut prendre quelques minutes pour être complètement prêt :

1. **Laissez le simulateur s'ouvrir complètement**
2. **Attendez 1-2 minutes** que tout soit chargé
3. **Relancez** :
   ```bash
   npm run ios
   ```

### Solution 2 : Ouvrir le Simulateur Manuellement

1. **Ouvrez le simulateur manuellement** :
   - Ouvrez **Xcode**
   - **Xcode** → **Open Developer Tool** → **Simulator**
   - Ou cherchez "Simulator" dans Spotlight (⌘ + Espace)

2. **Choisissez un iPhone** :
   - **Device** → **iPhone 11 Pro Max** (ou autre)

3. **Attendez que le simulateur démarre complètement**

4. **Relancez Expo** :
   ```bash
   npm start
   ```

5. **Dans le simulateur**, ouvrez Safari et allez sur :
   ```
   exp://192.168.1.109:8081
   ```
   (Remplacez par l'URL affichée dans votre terminal Expo)

### Solution 3 : Utiliser Expo Go dans le Simulateur

1. **Ouvrez le simulateur**
2. **Installez Expo Go** :
   - Ouvrez **App Store** dans le simulateur
   - Cherchez **"Expo Go"**
   - Installez-le

3. **Lancez Expo Go** dans le simulateur

4. **Scannez le QR code** ou entrez l'URL manuellement

### Solution 4 : Redémarrer le Serveur Expo

Parfois, il faut redémarrer :

1. **Arrêtez Expo** (Ctrl + C dans le terminal)

2. **Nettoyez le cache** :
   ```bash
   npx expo start --clear
   ```

3. **Relancez** :
   ```bash
   npm run ios
   ```

### Solution 5 : Vérifier la Connexion Réseau

Le problème peut venir du réseau :

1. **Vérifiez que vous êtes sur le même réseau WiFi**
2. **Essayez avec localhost** :
   ```bash
   npx expo start --localhost
   ```

3. **Ou utilisez tunnel** :
   ```bash
   npx expo start --tunnel
   ```

## 🎯 Solution Recommandée (Pour les Captures)

Si vous voulez juste faire des captures d'écran, vous pouvez :

1. **Ouvrir le simulateur manuellement** (Xcode → Simulator)
2. **Installer Expo Go** dans le simulateur
3. **Connecter manuellement** à votre serveur Expo
4. **Faire vos captures** avec ⌘ + S

## 📸 Alternative : Utiliser un iPhone Physique

Si le simulateur pose trop de problèmes :

1. **Installez Expo Go** sur votre iPhone
2. **Scannez le QR code** depuis le terminal Expo
3. **Faites vos captures** directement sur l'iPhone :
   - **iPhone X et plus** : Volume + + Power
   - **iPhone 8 et moins** : Home + Power

Puis transférez-les sur votre Mac.

## 🔍 Vérification

Pour vérifier que le simulateur fonctionne :

```bash
xcrun simctl list devices
```

Devrait afficher la liste des simulateurs disponibles.

---

**Astuce :** Si le simulateur est lent, essayez de redémarrer votre Mac après l'installation complète de Xcode.
