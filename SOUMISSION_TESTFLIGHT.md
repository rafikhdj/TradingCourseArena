# 🚀 Soumission à TestFlight - Guide Rapide

## ✅ État Actuel

- ✅ Build iOS créé avec succès
- ✅ Fichier .ipa disponible : https://expo.dev/artifacts/eas/p7pyy9UR3q871VimWhjRnU.ipa
- ✅ Clé API App Store Connect configurée
- ✅ Certificats générés automatiquement

## 📤 Soumettre à TestFlight

### Option 1 : Soumission Automatique (Recommandé)

**Prérequis :** Avoir créé l'app dans App Store Connect

1. **Créez l'app dans App Store Connect** (si pas déjà fait) :
   - Allez sur https://appstoreconnect.apple.com
   - Cliquez sur **"My Apps"** → **"+"** → **"New App"**
   - Remplissez :
     - **Platform** : iOS
     - **Name** : TradingCourseArena
     - **Primary Language** : Français (ou votre choix)
     - **Bundle ID** : `com.kirafh.TradingCourseArena`
     - **SKU** : `TradingCourseArena` (identifiant unique)
   - Cliquez sur **"Create"**

2. **Notez l'App ID** :
   - Dans App Store Connect → Votre App → Informations générales
   - Notez l'**ID Apple** (ex: `1234567890`)

3. **Mettez à jour `eas.json`** :

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "votre-email@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "W9KDL8AB9B"
      }
    }
  }
}
```

4. **Soumettez** :

```bash
eas submit --platform ios --profile production
```

### Option 2 : Soumission Manuelle (Plus Simple)

1. **Téléchargez le fichier .ipa** :
   - Visitez : https://expo.dev/artifacts/eas/p7pyy9UR3q871VimWhjRnU.ipa
   - Téléchargez le fichier

2. **Utilisez Transporter** (Mac) :
   - Ouvrez l'app **Transporter** (disponible sur Mac App Store)
   - Glissez-déposez le fichier `.ipa`
   - Cliquez sur **"Deliver"**
   - Connectez-vous avec votre Apple ID

3. **Dans App Store Connect** :
   - Allez dans **TestFlight**
   - Attendez 10-30 minutes que le build soit traité
   - Le statut passera de "Processing" à "Ready to Test"

## ✅ Après la Soumission

1. **Vérifiez le build** dans App Store Connect → TestFlight
2. **Ajoutez des testeurs** (TestFlight → Testeurs)
3. **Testez sur votre iPhone** avec l'app TestFlight

---

**Recommandation :** Utilisez l'Option 2 (Manuelle) si vous n'avez pas encore créé l'app dans App Store Connect. C'est plus simple et plus rapide pour commencer.
