# Mental Math Sessions - Statistiques par Durée

## Nouveau système de statistiques

Au lieu de stocker chaque tentative individuelle, on stocke maintenant **une session par partie jouée** avec :
- `duration_seconds` : 60, 120, ou 180
- `correct_count` : nombre de bonnes réponses dans cette session
- `total_questions` : nombre total de questions
- `created_at` : date de la session

## Installation

### 1. Exécuter le schéma SQL

Dans Supabase SQL Editor, exécutez :
```
supabase/mental_math_sessions_schema.sql
```

Cela crée :
- Table `mental_math_sessions`
- Indexes pour les performances
- Policies RLS
- Fonction RPC `get_mental_math_sessions()`

### 2. Structure de la table

```sql
mental_math_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  duration_seconds INTEGER (60, 120, ou 180),
  correct_count INTEGER,
  total_questions INTEGER,
  created_at TIMESTAMP
)
```

## Fonctionnement

### Enregistrement des sessions

Quand une partie Mental Math se termine :
1. `QuizResultScreen` calcule le nombre de bonnes réponses
2. Récupère la durée depuis `MentalMathConfig`
3. Insère une ligne dans `mental_math_sessions`
4. Met à jour le leaderboard avec les points

### Affichage des statistiques

Dans l'écran "Mental Math Stats" :
- **3 courbes** affichées, une par durée (60s, 120s, 180s)
- Chaque courbe montre l'évolution du nombre de bonnes réponses au fil du temps
- Les sessions sont triées par date (plus anciennes à gauche, plus récentes à droite)

## Format des données

Pour chaque durée, les données sont un tableau de nombres :
- **60s** : `[10, 12, 15, 14, ...]` (nombre de bonnes réponses par session)
- **120s** : `[20, 22, 25, 24, ...]`
- **180s** : `[30, 32, 35, 34, ...]`

## Exemple

Si vous jouez 5 parties de 60 secondes :
- Session 1 : 10 bonnes réponses → `[10]`
- Session 2 : 12 bonnes réponses → `[10, 12]`
- Session 3 : 15 bonnes réponses → `[10, 12, 15]`
- Session 4 : 14 bonnes réponses → `[10, 12, 15, 14]`
- Session 5 : 16 bonnes réponses → `[10, 12, 15, 14, 16]`

La courbe affichera ces 5 points connectés par des lignes.

## Fichiers modifiés/créés

1. **`supabase/mental_math_sessions_schema.sql`** : Schéma de la table
2. **`src/services/mentalMathSessionsService.ts`** : Service pour récupérer les sessions
3. **`src/hooks/useMentalMathSessions.ts`** : Hook React Query
4. **`src/screens/practice/QuizResultScreen.tsx`** : Enregistre les sessions
5. **`src/screens/profile/MentalMathStatsScreen.tsx`** : Affiche les courbes
6. **`src/types/index.ts`** : Ajout de `MentalMathSession`

## Test

1. Jouez plusieurs parties Mental Math avec différentes durées (60s, 120s, 180s)
2. Allez dans Profile → Mental Math Stats
3. Vous devriez voir 3 courbes (une par durée) montrant votre progression

## Notes

- Les anciennes tentatives individuelles (`mental_math_attempts`) ne sont plus utilisées pour les stats
- Seules les sessions sont enregistrées maintenant
- Chaque partie = 1 session = 1 point sur la courbe

