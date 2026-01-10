# TradingCourseArena

A mobile app for junior traders to train for trading interviews. Built with React Native, Expo, TypeScript, and Supabase.

## Features (MVP)

- **Authentication**: Sign up / Sign in with email and password
- **Practice Modes**: 
  - Mental Math
  - Probability
  - Brainteasers
  - Market Making
- **Quiz System**: 
  - Multiple choice, numeric, and free-text questions
  - Instant feedback with explanations
  - Performance tracking
- **Leaderboard**: Global ranking based on points
- **Profile**: View stats and performance breakdown by topic
- **Arena**: Placeholder for future one-on-one battles (mock battle available)

## Tech Stack

- **Mobile**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Query
- **Navigation**: React Navigation (Bottom Tabs + Stack Navigators)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: React Native StyleSheet

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Supabase account

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API
3. Copy your Project URL and anon/public key

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Alternatively, you can add these to `app.json` under `expo.extra`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "your_supabase_project_url",
      "supabaseAnonKey": "your_supabase_anon_key"
    }
  }
}
```

### 4. Set Up Database

1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the SQL from `supabase/schema.sql` to create tables and policies
4. Run the SQL from `supabase/seed.sql` to add sample questions

### 5. Run the App

```bash
npm start
# or
npx expo start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/           # Custom React hooks for data fetching
├── navigation/      # Navigation configuration
├── screens/         # Screen components
│   ├── auth/        # Authentication screens
│   ├── home/        # Home screen
│   ├── practice/    # Practice/quiz screens
│   ├── arena/       # Arena/battle screens
│   └── profile/      # Profile screens
├── services/        # API services (Supabase client)
├── theme/           # Colors and typography
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Database Schema

- **users**: User profiles (extends Supabase auth)
- **questions**: Practice questions with topics and difficulty
- **question_attempts**: User answers and performance
- **leaderboard_scores**: Points and rankings

See `supabase/schema.sql` for full schema details.

## Features in Detail

### Practice Flow

1. Select a topic from Home screen
2. Choose difficulty and number of questions
3. Answer questions one by one
4. View results with explanations
5. Points are automatically calculated and added to leaderboard

### Scoring System

- Points = correct_answers × difficulty_multiplier
- Easy: 1x multiplier
- Medium: 2x multiplier
- Hard: 3x multiplier

### Leaderboard

- Shows top 10 users globally
- Displays current user's rank and points
- Updates automatically after each quiz

## Development

### Adding New Questions

Insert questions into the `questions` table:

```sql
INSERT INTO questions (statement, topic, difficulty, type, choices, answer, explanation)
VALUES (
  'Your question here',
  'mental_math',  -- or 'probability', 'brainteaser', 'market_making'
  2,              -- 1-5
  'mcq',          -- or 'numeric', 'free_text'
  '[{"id": "a", "label": "Option A"}, ...]',  -- null for non-MCQ
  'correct_answer',
  'Explanation here'
);
```

## Future Enhancements (V2)

- Real-time one-on-one battles
- Social features (challenge friends)
- More question types
- Advanced analytics
- Custom practice sets
- Study mode

## License

MIT

