# 🔐 Solution : Authentification Apple avec EAS

## Problème
Votre compte Apple est déverrouillé et vous pouvez vous connecter en ligne, mais EAS ne peut pas s'authentifier.

## ✅ Solution Recommandée : Utiliser une Clé API App Store Connect

Au lieu d'utiliser votre mot de passe Apple directement, créez une **clé API** qui est plus sécurisée et fonctionne mieux avec EAS.

### Étape 1 : Créer une Clé API App Store Connect

1. **Allez sur App Store Connect** : https://appstoreconnect.apple.com
2. **Connectez-vous** avec votre Apple ID
3. **Allez dans** : **Users and Access** → **Keys** (onglet en haut)
4. **Cliquez sur** : **Generate API Key** ou le bouton **+**
5. **Remplissez** :
   - **Name** : `EAS Build Key` (ou n'importe quel nom)
   - **Access** : **App Manager** (ou **Admin** si vous êtes admin)
6. **Cliquez sur** : **Generate**
7. **Téléchargez la clé** (fichier `.p8`) - **IMPORTANT : Vous ne pourrez la télécharger qu'une seule fois !**
8. **Notez** :
   - **Key ID** (ex: `ABC123DEF4`)
   - **Issuer ID** (visible en haut de la page Keys, ex: `12345678-1234-1234-1234-123456789012`)

### Étape 2 : Configurer EAS avec la Clé API

Dans votre terminal, exécutez :

```bash
eas credentials
```

Puis :
1. Sélectionnez **iOS**
2. Sélectionnez **Set up App Store Connect API Key**
3. Entrez :
   - **Key ID** : (celui que vous avez noté)
   - **Issuer ID** : (celui que vous avez noté)
   - **Path to .p8 file** : Le chemin vers le fichier `.p8` téléchargé

### Alternative : Réessayer avec l'authentification normale

Si vous préférez utiliser l'authentification normale :

1. **Vérifiez l'authentification à deux facteurs** :
   - Assurez-vous que la 2FA est activée sur votre compte Apple
   - EAS peut demander un code de vérification

2. **Attendez quelques minutes** :
   - Si le compte vient d'être déverrouillé, attendez 5-10 minutes avant de réessayer

3. **Réessayez le build** :
   ```bash
   eas build --platform ios --profile production
   ```

4. **Si ça ne fonctionne toujours pas**, utilisez la méthode de la clé API (recommandée ci-dessus)

## 🔑 Pourquoi utiliser une Clé API ?

- ✅ Plus sécurisé (pas besoin de partager votre mot de passe)
- ✅ Fonctionne mieux avec les outils automatisés comme EAS
- ✅ Pas de problèmes avec la 2FA
- ✅ Plus fiable pour les builds automatisés

## 📝 Note

Le fichier `.p8` est **très important** - gardez-le en sécurité et ne le partagez jamais. Vous pouvez le stocker dans un endroit sûr sur votre Mac.

---

**Recommandation :** Utilisez la clé API App Store Connect, c'est la méthode la plus fiable pour EAS.
