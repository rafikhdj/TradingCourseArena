# Debug: Questions ne s'affichent pas

## Problème
Les questions sont insérées dans la base de données mais ne s'affichent pas quand on clique sur "Practice" pour Probability.

## Cause identifiée

Les questions que vous avez insérées ont toutes `difficulty = 1`, mais :
- La difficulté par défaut dans `PracticeSetupScreen` était `'medium'`
- `'medium'` correspond à `difficulty` entre 2 et 4 (voir `difficulty.ts`)
- Donc les questions avec `difficulty = 1` ne sont pas récupérées

## Solution appliquée

1. **Changé la difficulté par défaut** de `'medium'` à `'easy'` dans `PracticeSetupScreen`
   - `'easy'` correspond à `difficulty` entre 1 et 2
   - Donc vos questions avec `difficulty = 1` seront maintenant récupérées

2. **Ajouté des messages d'erreur** pour diagnostiquer les problèmes :
   - Message si aucune question n'est trouvée
   - Message si une erreur se produit lors de la récupération
   - Logs dans la console pour le debugging

## Mapping des difficultés

Selon `src/utils/difficulty.ts` :
- **Easy** : difficulty 1-2
- **Medium** : difficulty 2-4
- **Hard** : difficulty 4-5

Vos questions ont `difficulty = 1`, donc elles correspondent à **Easy**.

## Test

1. Cliquez sur "Probability" sur l'écran Home
2. Sur Practice Setup, la difficulté devrait être "Easy" par défaut
3. Cliquez sur "Start Practice"
4. Les questions devraient maintenant s'afficher

## Si ça ne fonctionne toujours pas

Vérifiez dans Supabase SQL Editor :

```sql
-- Vérifier que les questions existent
SELECT id, statement, topic, difficulty, type
FROM questions
WHERE topic = 'probability'
ORDER BY difficulty;

-- Devrait afficher vos 20 questions avec difficulty = 1
```

Si les questions n'apparaissent pas :
1. Vérifiez les logs dans la console de l'app
2. Vérifiez les erreurs dans Supabase (Dashboard → Logs)
3. Vérifiez que les policies RLS permettent la lecture

## Pour ajouter des questions avec différentes difficultés

Si vous voulez des questions "Medium" ou "Hard", insérez-les avec :
- `difficulty = 2` ou `3` pour Medium
- `difficulty = 4` ou `5` pour Hard

