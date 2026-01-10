# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create account at [supabase.com](https://supabase.com)
   - Create a new project
   - Go to Project Settings > API
   - Copy your Project URL and anon key

3. **Configure environment:**
   
   Option A: Create `.env` file:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
   
   Option B: Add to `app.json`:
   ```json
   {
     "expo": {
       "extra": {
         "supabaseUrl": "https://your-project.supabase.co",
         "supabaseAnonKey": "your-anon-key-here"
       }
     }
   }
   ```

4. **Set up database:**
   - Open Supabase SQL Editor
   - Run `supabase/schema.sql` to create tables
   - Run `supabase/seed.sql` to add sample questions

5. **Run the app:**
   ```bash
   npm start
   # or
   npx expo start
   ```

## Database Setup Details

### Step 1: Create Tables

Copy and paste the entire contents of `supabase/schema.sql` into the Supabase SQL Editor and run it. This will:
- Create all necessary tables
- Set up indexes for performance
- Configure Row Level Security (RLS) policies
- Create helper functions

### Step 2: Seed Data

Copy and paste the contents of `supabase/seed.sql` into the SQL Editor and run it. This adds:
- 10 Mental Math questions
- 8 Probability questions
- 8 Brainteaser questions
- 8 Market Making questions

### Step 3: Verify Setup

Check that tables were created:
- `users`
- `questions`
- `question_attempts`
- `leaderboard_scores`

## Troubleshooting

### "Missing Supabase environment variables" error

Make sure you've set `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` in your `.env` file or `app.json`.

### Database connection issues

- Verify your Supabase project is active
- Check that your URL and anon key are correct
- Ensure RLS policies are set up correctly

### Navigation errors

Make sure all dependencies are installed:
```bash
npm install
```

### Questions not loading

- Verify seed data was inserted: Check `questions` table in Supabase
- Check RLS policies allow SELECT on questions table

## Next Steps

Once setup is complete:
1. Sign up for a new account
2. Try a practice quiz
3. Check your profile and leaderboard rank
4. Explore the Arena mock battle

