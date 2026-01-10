# Résumé de la Conversation - TradingCourseArena

**Date**: Décembre 2024  
**Projet**: TradingCourseArena - Application d'entraînement aux mathématiques mentales et questions quantitatives

---

## 📋 Vue d'ensemble du Projet

Application React Native (Expo) avec Supabase backend qui propose :
- **Home Tab** : Quiz infini avec questions aléatoires (mental math, probability, brainteaser, derivatives)
- **Training Tab** : Mode d'entraînement classique avec sélection de topics et configuration
- **Profile Tab** : Statistiques et historique des sessions

---

## 🔧 Problèmes Résolus

### 1. **Problème d'email de confirmation après inscription**
**Symptôme**: Pas de mail de confirmation reçu après sign-up  
**Solution**: 
- Désactiver "Enable email confirmations" dans Supabase Auth settings pour le développement
- Script SQL pour confirmer manuellement les utilisateurs si nécessaire

```sql
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'votre-email@example.com';
```

### 2. **Impossibilité d'insérer des données dans la table `questions`**
**Symptôme**: `INSERT` retourne "Success. No rows returned." mais aucune ligne n'est insérée  
**Cause**: RLS (Row Level Security) bloquait les insertions  
**Solution**: Ajout d'une policy INSERT permissive :

```sql
CREATE POLICY "Anyone can insert questions" 
ON questions 
FOR INSERT 
WITH CHECK (true);
```

**Fichier**: `supabase/schema.sql`

### 3. **Erreur "invalid credential" après sign-up puis sign-in**
**Symptôme**: Inscription réussie mais impossible de se connecter  
**Cause**: Email non confirmé  
**Solution**: Amélioration des messages d'erreur dans `SignInScreen.tsx` et `useAuth.ts` pour guider l'utilisateur si la confirmation email est requise

### 4. **Erreur JSON Parse: "Unexpected character: <"**
**Symptôme**: Erreur de parsing JSON lors de l'authentification  
**Cause**: Supabase API retourne du HTML (page d'erreur) au lieu de JSON, généralement dû à une URL/clef Supabase incorrecte  
**Solution**: 
- Amélioration du logging d'erreurs dans `useAuth.ts`
- Ajout de warnings dans `supabaseClient.ts` pour vérifier la configuration

### 5. **Table `mental_math_attempts` non trouvée**
**Symptôme**: `ERROR Error inserting mental math attempt: Could not find the table 'public.mental_math_attempts'`  
**Cause**: Migration vers un système de sessions (sommaire) au lieu d'enregistrer chaque tentative individuelle  
**Solution**: Suppression de l'appel à `insertMentalMathAttempt` dans `QuizScreen.tsx`

### 6. **Sessions Mental Math non sauvegardées + double insertion**
**Symptômes**: 
- Les sessions ne sont pas sauvegardées en base
- Double insertion observée dans les logs
- Erreur RLS pour `leaderboard_scores`

**Causes**:
1. `useEffect` avec dépendances vides `[]` s'exécutait avant que l'utilisateur soit chargé
2. Pas de protection contre les soumissions multiples
3. Fonction RPC `increment_leaderboard_points` manquait `SECURITY DEFINER` et `SET search_path`

**Solutions**:
1. Ajout de dépendances au `useEffect`: `[user, attempts.length, isMentalMath, timeSpentSeconds]`
2. Utilisation d'un `useRef` (`hasSubmittedRef`) pour éviter les doubles soumissions
3. Modification de la fonction RPC :

```sql
CREATE OR REPLACE FUNCTION increment_leaderboard_points(...)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- ...
$$;
```

**Fichiers modifiés**:
- `src/screens/practice/QuizResultScreen.tsx`
- `supabase/schema.sql` (fonction `increment_leaderboard_points`)

### 7. **Réponse fractionnaire "5/12" non reconnue comme correcte**
**Symptôme**: Les questions de probabilité avec réponse fractionnaire (ex: "5/12") ne sont pas reconnues comme correctes  
**Cause**: `parseFloat("5/12")` retourne `5` au lieu de calculer la fraction  
**Solution**: Implémentation de fonctions `parseFraction` et `normalizeFraction` dans `InfiniteQuizScreen.tsx` pour parser correctement les fractions et les comparer numériquement

**Fichier**: `src/screens/home/InfiniteQuizScreen.tsx`

### 8. **Erreurs TypeScript: `checkAndPreload` et `TrainingScreen`**
**Symptômes**:
- `checkAndPreload` n'existe plus dans `useInfiniteQuestions`
- `TrainingScreen` n'est pas exporté correctement

**Solutions**:
- Suppression des références à `checkAndPreload` dans `InfiniteQuizScreen.tsx` (logique intégrée dans `nextQuestion`)
- Correction de l'export dans `src/screens/training/TrainingScreen.tsx`

### 9. **Bug: Cadre de réponse reste ouvert après Skip**
**Symptôme**: Quand on clique sur "Voir la réponse" puis "Skip", le cadre de réponse reste ouvert pour la question suivante  
**Cause**: Le `useEffect` ne réinitialisait `showAnswer` que pour les questions numériques  
**Solution**: Réinitialisation de `showAnswer` pour tous les types de questions dans le `useEffect`

**Fichier**: `src/screens/home/InfiniteQuizScreen.tsx`

---

## ✨ Fonctionnalités Implémentées

### 1. **Système de Statistiques Mental Math**
- Table `mental_math_sessions` pour stocker les résumés de sessions
- Affichage de courbes de progression (60s, 120s, 180s) dans `MentalMathStatsScreen`
- Graphique SVG simple pour visualiser la progression

**Fichiers**:
- `supabase/mental_math_sessions_schema.sql`
- `src/screens/profile/MentalMathStatsScreen.tsx`
- `src/hooks/useMentalMathSessions.ts`
- `src/services/mentalMathSessionsService.ts`

### 2. **Quiz Infini sur Home Tab**
Remplacement de l'ancienne page Home par un quiz infini avec :
- **Format**: Une question à la fois, format quiz
- **Interaction**: Feedback immédiat, auto-advance sur réponse correcte
- **Topics**: Mental math (60%), Probability (25%), Brainteaser (15%), Derivatives (uniforme)
- **Chargement**: Par batch de 10-20 questions, préchargement quand il reste 3-4 questions
- **Boutons**: "Skip" et "Voir la réponse"

**Fichiers**:
- `src/screens/home/InfiniteQuizScreen.tsx`
- `src/hooks/useInfiniteQuestions.ts`

### 3. **Renommage de Market Making → Derivatives**
- Remplacement du topic `market_making` par `derivatives` partout dans le code
- Mise à jour du schéma de base de données
- Questions de derivatives avec le même format que probability (MCQ principalement)

**Fichiers modifiés**:
- `src/types/index.ts`
- `supabase/schema.sql`
- `src/data/mockQuestions.ts`
- `src/hooks/useInfiniteQuestions.ts`

### 4. **Filtrage des Questions Probability**
- Filtre: Seulement MCQ (multiple choice)
- Difficulté: Medium à Hard (2-5)
- Amélioration de la randomisation: Pool de 500 questions au lieu de 100, shuffle Fisher-Yates

**Fichier**: `src/hooks/useInfiniteQuestions.ts`

### 5. **Reorganisation de la Navigation**
- **HomeTab** → Quiz infini (nouveau)
- **TrainingTab** → Ancienne page Home (renommée)
- **ProfileTab** → Stats et historique
- Suppression de l'onglet Arena

**Fichiers**:
- `src/navigation/types.ts`
- `src/screens/training/TrainingScreen.tsx` (ancien `HomeScreen.tsx`)

---

## 🗄️ Configuration Supabase

### Tables Principales

#### `questions`
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  statement TEXT NOT NULL,
  topic TEXT NOT NULL CHECK (topic IN ('mental_math', 'probability', 'brainteaser', 'derivatives')),
  difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
  type TEXT NOT NULL CHECK (type IN ('mcq', 'numeric', 'free_text')),
  choices JSONB,
  answer JSONB NOT NULL,
  explanation TEXT,
  theme TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**RLS Policies**:
- SELECT: public
- INSERT: authenticated (ou policy permissive pour le développement)

#### `mental_math_sessions`
Stocke les résumés de sessions Mental Math avec:
- `user_id`
- `total_questions`
- `correct_count`
- `duration_seconds`
- `created_at`

**Fichier**: `supabase/mental_math_sessions_schema.sql`

### Fonctions RPC

#### `increment_leaderboard_points`
⚠️ **Important**: Doit avoir `SECURITY DEFINER` et `SET search_path = public` pour fonctionner avec RLS.

```sql
CREATE OR REPLACE FUNCTION increment_leaderboard_points(...)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
-- ...
$$;
```

---

## 📁 Structure du Code

### Navigation
```
src/navigation/
├── types.ts              # Types TypeScript pour la navigation
├── ProfileNavigator.tsx  # Navigateur pour le profil
└── ...                   # Autres navigateurs
```

### Screens
```
src/screens/
├── home/
│   └── InfiniteQuizScreen.tsx    # Nouveau quiz infini (Home Tab)
├── training/
│   └── TrainingScreen.tsx         # Ancien HomeScreen (Training Tab)
├── practice/
│   ├── QuizScreen.tsx             # Écran de quiz (Training mode)
│   └── QuizResultScreen.tsx       # Résultats et sauvegarde de session
└── profile/
    ├── ProfileScreen.tsx
    └── MentalMathStatsScreen.tsx  # Stats avec graphiques
```

### Hooks
```
src/hooks/
├── useInfiniteQuestions.ts       # Gestion du quiz infini (batch loading)
├── useMentalMathStats.ts
├── useMentalMathSessions.ts
└── useAuth.ts                    # Authentification Supabase
```

### Services
```
src/services/
├── mentalMathSessionsService.ts  # Service pour les sessions
├── mentalMathService.ts          # Service Mental Math (ancien)
└── supabaseClient.ts             # Client Supabase initialisé
```

### Utils
```
src/utils/
└── mentalMath.ts                 # Génération de questions Mental Math
```

### Types
```
src/types/
└── index.ts                      # Types TypeScript pour tout le projet
```

---

## 🔑 Points Techniques Importants

### 1. Génération de Questions Mental Math
Le fichier `src/utils/mentalMath.ts` génère des questions dynamiques avec plusieurs formats:
- `standard`: Addition, soustraction, multiplication basique
- `gap`: Question avec trou (ex: `? + 15 = 20`)
- `decimal`: Opérations avec décimales
- `fraction`: Opérations avec fractions
- `percentage`: Calculs de pourcentages
- `decimal_multiple`: Multiplication de plusieurs décimales
- `fraction_operation`: Opérations complexes sur fractions

Chaque question inclut des `metadata` (type, operator, has_gap) pour le tracking.

### 2. Parsing de Réponses Numériques
Dans `InfiniteQuizScreen.tsx`, fonctions pour parser:
- Fractions: `"5/12"` → `0.41666...`
- Nombres décimaux: `"3.14"` → `3.14`
- Nombres entiers: `"42"` → `42`

Comparaison numérique avec tolérance pour les erreurs d'arrondi.

### 3. Gestion du Batch Loading
Dans `useInfiniteQuestions.ts`:
- Génère un batch de 10-20 questions
- Distribution uniforme: 25% chaque topic (mental_math, probability, brainteaser, derivatives)
- Précharge le batch suivant quand il reste `PRELOAD_THRESHOLD` (3-4) questions
- Shuffle Fisher-Yates pour randomisation

### 4. Prévention des Doubles Soumissions
Dans `QuizResultScreen.tsx`:
- Utilisation de `useRef` (`hasSubmittedRef`) pour tracker si la soumission a déjà été faite
- Protection dans le `useEffect` pour éviter les multiples appels

### 5. Gestion de l'État dans le Quiz Infini
- `showAnswer`: État pour afficher/cacher la réponse
- Réinitialisation automatique quand `currentQuestion` change (dans `useEffect`)
- `isSubmitting`: Ref pour éviter les interactions multiples

---

## 🐛 Bugs Corrigés Récemment

### Bug: Cadre de réponse reste ouvert après Skip
**Date**: Dernière correction  
**Fichier**: `src/screens/home/InfiniteQuizScreen.tsx`  
**Correction**: Réinitialisation de `showAnswer` pour tous les types de questions (pas seulement numériques)

---

## 📝 Notes pour Développement Futur

1. **Email Confirmation**: Actuellement désactivée pour le développement. À réactiver en production.

2. **RLS Policies**: Les policies INSERT sur `questions` sont permissives. À restreindre en production selon les besoins.

3. **Randomisation**: Le pool de 500 questions pour la randomisation peut être ajusté selon le nombre de questions en base.

4. **Performance**: Le préchargement de batch fonctionne bien, mais peut nécessiter des ajustements si le nombre de questions devient très important.

5. **Sessions Mental Math**: Actuellement sauvegardées uniquement en fin de quiz (dans `QuizResultScreen`). Pour le quiz infini, considérer une sauvegarde périodique ou à la fermeture de l'app.

---

## 🔗 Références Utiles

### Supabase
- Dashboard: Vérifier les tables, RLS policies, RPC functions
- Auth Settings: Configuration de l'email confirmation
- SQL Editor: Pour exécuter des requêtes directes

### Documentation
- TypeScript types dans `src/types/index.ts`
- Schémas SQL dans `supabase/`

---

## 📌 Commandes Utiles

### Vérifier les erreurs TypeScript
```bash
npx tsc --noEmit
```

### Lancer l'app
```bash
npm start
# ou
expo start
```

### Exécuter une migration SQL
Copier le contenu du fichier SQL dans Supabase SQL Editor et exécuter.

---

**Dernière mise à jour**: Décembre 2024  
**Dernière correction**: Bug du cadre de réponse qui reste ouvert après Skip

