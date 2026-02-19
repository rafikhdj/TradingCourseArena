# 🔧 Corriger l'Erreur du Simulateur iOS

## ❌ Problème

```
Error: xcrun simctl help exited with non-zero code: 69
CommandError: xcrun is not configured correctly.
```

## ✅ Solution

### Option 1 : Réinitialiser Xcode (Recommandé)

Exécutez cette commande dans votre terminal :

```bash
sudo xcode-select --reset
```

**Note :** Vous devrez entrer votre mot de passe administrateur.

### Option 2 : Sélectionner le Chemin Xcode Manuellement

Si l'Option 1 ne fonctionne pas :

1. **Trouvez le chemin de Xcode** :
   ```bash
   ls /Applications/ | grep -i xcode
   ```

2. **Sélectionnez le chemin** :
   ```bash
   sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
   ```

   Ou si vous avez Xcode-beta :
   ```bash
   sudo xcode-select --switch /Applications/Xcode-beta.app/Contents/Developer
   ```

### Option 3 : Accepter la Licence Xcode

Parfois, il faut accepter la licence Xcode :

```bash
sudo xcodebuild -license accept
```

### Option 4 : Vérifier que Xcode est Installé

Assurez-vous que Xcode est installé :

1. Ouvrez **App Store**
2. Cherchez **Xcode**
3. Installez-le si nécessaire (c'est gros, ~15GB)

## 🔍 Vérification

Après avoir corrigé, vérifiez que ça fonctionne :

```bash
xcode-select -p
```

Devrait afficher quelque chose comme :
```
/Applications/Xcode.app/Contents/Developer
```

Puis testez le simulateur :

```bash
xcrun simctl list devices
```

## 🚀 Après la Correction

Une fois corrigé, relancez :

```bash
npm run ios
```

Ou :

```bash
npx expo start --ios
```

## 📝 Notes

- **Xcode est requis** pour utiliser le simulateur iOS
- **Xcode est gratuit** mais prend beaucoup d'espace (~15GB)
- **Command Line Tools** sont inclus avec Xcode
- Le simulateur peut prendre quelques minutes à démarrer la première fois

## 🆘 Si Rien ne Fonctionne

1. **Réinstallez Xcode** depuis l'App Store
2. **Ouvrez Xcode** au moins une fois pour accepter les licences
3. **Installez les composants** supplémentaires si demandé
4. **Réessayez** `sudo xcode-select --reset`

---

**Une fois corrigé, vous pourrez utiliser le simulateur iOS pour créer vos captures d'écran !** 📸
