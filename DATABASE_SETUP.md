# Database Setup Instructions

## How to Set Up Your Supabase Database

### Step 1: Open Supabase SQL Editor

1. Go to [supabase.com](https://supabase.com) and log in
2. Select your project (or create a new one)
3. In the left sidebar, click on **SQL Editor**

### Step 2: Run the Schema SQL

1. Open the file `supabase/schema.sql` in this project
2. **Copy the ENTIRE contents** of `supabase/schema.sql`
3. Paste it into the Supabase SQL Editor
4. Click the **Run** button (or press Cmd+Enter / Ctrl+Enter)
5. You should see "Success. No rows returned"

### Step 3: Run the Seed Data SQL

1. Open the file `supabase/seed.sql` in this project
2. **Copy the ENTIRE contents** of `supabase/seed.sql`
3. Paste it into the Supabase SQL Editor (you can clear the previous query or run in a new tab)
4. Click the **Run** button
5. You should see "Success. X rows inserted" (where X is the number of questions)

### Step 4: Verify Tables Were Created

1. In Supabase, go to **Table Editor** in the left sidebar
2. You should see these tables:
   - `users`
   - `questions`
   - `question_attempts`
   - `leaderboard_scores`

### Step 5: Verify Questions Were Inserted

1. Click on the `questions` table
2. You should see 34 questions (10 mental math + 8 probability + 8 brainteasers + 8 market making)

## Important Notes

- **DO NOT** try to run the SQL files from the terminal - they must be run in Supabase's SQL Editor
- The SQL files are meant to be copied and pasted into the Supabase web interface
- Make sure you run `schema.sql` BEFORE `seed.sql`
- If you get errors, check that you copied the entire file contents

## Troubleshooting

### Error: "relation already exists"
- The tables might already be created. You can either:
  - Drop the existing tables and recreate them
  - Or skip the schema.sql and just run seed.sql if tables already exist

### Error: "permission denied"
- Make sure you're logged into Supabase
- Make sure you're in the correct project
- Check that your project is active (not paused)

### Questions not showing
- Make sure you ran `seed.sql` after `schema.sql`
- Check the `questions` table in Table Editor to see if data exists

