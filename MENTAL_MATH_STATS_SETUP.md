# Mental Math Statistics Setup

This document describes the Mental Math statistics system implementation.

## Database Setup

### 1. Run the SQL Schema

In your Supabase SQL Editor, run the contents of:
```
supabase/mental_math_schema.sql
```

This will create:
- `mental_math_attempts` table to store individual question attempts
- Indexes for performance
- Row Level Security (RLS) policies
- RPC function `get_mental_math_stats(user_id_param UUID)` for aggregated statistics

### 2. Table Structure

The `mental_math_attempts` table contains:
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key to users)
- `created_at` (timestamp)
- `type` ('integer', 'fraction', 'decimal')
- `operator` ('addition', 'subtraction', 'multiplication', 'division')
- `has_gap` (boolean) - indicates difficulty gap (e.g., 2-digit vs 1-digit operands)
- `time_ms` (integer) - time taken to answer in milliseconds
- `is_correct` (boolean)

### 3. RPC Function

The `get_mental_math_stats` function returns aggregated statistics grouped by:
- Type (integer/fraction/decimal)
- Operator (addition/subtraction/multiplication/division)
- Gap (Yes/No)

For each category, it returns:
- `user_avg_time` - Average time in seconds for the user
- `user_avg_correct_pct` - Average correctness percentage for the user
- `platform_avg_time` - Average time in seconds across all users
- `platform_avg_correct_pct` - Average correctness percentage across all users
- `user_percent_rank` - User's percentile rank (0-100)

## How It Works

### Automatic Data Collection

Every time a user answers a Mental Math question in `QuizScreen`:
1. The question's metadata (type, operator, has_gap) is stored with the question
2. When the user submits an answer, an attempt is automatically saved to `mental_math_attempts`
3. The attempt includes:
   - User ID
   - Question metadata
   - Time taken to answer
   - Whether the answer was correct

### Statistics Display

Users can view their Mental Math statistics by:
1. Going to the Profile screen
2. Tapping "Mental Math Stats"
3. Viewing breakdown by Type, Operator, and Gap

## Frontend Implementation

### Components

- **`MentalMathStatsScreen`** (`src/screens/profile/MentalMathStatsScreen.tsx`)
  - Displays statistics in card format
  - Shows user performance vs platform average
  - Displays percentile rank

- **`useMentalMathStats` hook** (`src/hooks/useMentalMathStats.ts`)
  - Fetches statistics using React Query
  - Calls the Supabase RPC function

- **`mentalMathService`** (`src/services/mentalMathService.ts`)
  - `insertMentalMathAttempt()` - Saves individual attempts
  - `getMentalMathStats()` - Fetches aggregated stats

### Integration

The system is integrated into:
- `QuizScreen` - Automatically saves attempts when answering Mental Math questions
- `ProfileScreen` - Button to navigate to statistics
- `ProfileNavigator` - Navigation stack includes MentalMathStats screen

## Testing

1. Play several Mental Math games
2. Answer questions (both correctly and incorrectly)
3. Go to Profile → Mental Math Stats
4. Verify statistics are displayed correctly

## Future Enhancements

- Support for fraction and decimal question types
- More sophisticated gap detection logic
- Historical trends over time
- Comparison with specific users or groups

