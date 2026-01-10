# How to Launch TradingCourseArena

## Quick Launch Steps

### 1. Install Dependencies (First Time Only)

```bash
npm install
```

### 2. Set Up Supabase Environment Variables

**Option A: Using .env file (Recommended)**

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Option B: Using app.json**

Edit `app.json` and add to the `expo` object:
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://ugplmpgdtyhtqmqlvzgb.supabase.co",
      "supabaseAnonKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVncGxtcGdkdHlodHFtcWx2emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTAyNjYsImV4cCI6MjA3OTQ4NjI2Nn0.peNO2DdMjnvFXs8WEm8R5Ohc2cJHXMHhOrSxEKGu19A"
    }
  }
}
```

> **Get your Supabase credentials:**
> 1. Go to [supabase.com](https://supabase.com) and create/login to your project
> 2. Navigate to **Project Settings** → **API**
> 3. Copy **Project URL** and **anon/public key**

### 3. Set Up Database (First Time Only)

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase/schema.sql` → Click **Run**
4. Copy and paste the contents of `supabase/seed.sql` → Click **Run**

### 4. Launch the App

```bash
npm start
```

This will:
- Start the Expo development server
- Show a QR code in your terminal
- Open Expo DevTools in your browser

### 5. Run on Your Device/Simulator

**On iOS Simulator:**
```bash
npm run ios
# or press 'i' in the terminal
```

**On Android Emulator:**
```bash
npm run android
# or press 'a' in the terminal
```

**On Physical Device:**
1. Install **Expo Go** app from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in your terminal
3. The app will load on your device

**On Web Browser:**
```bash
npm run web
# or press 'w' in the terminal
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Make sure `.env` file exists in the root directory
- Verify the variable names are exactly: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Restart the Expo server after creating/modifying `.env`

### Error: "Cannot connect to Supabase"
- Check your internet connection
- Verify Supabase project is active (not paused)
- Double-check your URL and anon key are correct
- Make sure you've run the database schema SQL

### App crashes on launch
- Make sure all dependencies are installed: `npm install`
- Clear cache: `npx expo start -c`
- Check that database tables exist in Supabase

### Questions not showing
- Verify you ran `supabase/seed.sql` in Supabase SQL Editor
- Check the `questions` table in Supabase dashboard has data

## Quick Commands Reference

```bash
# Start development server
npm start

# Start with cache cleared
npx expo start -c

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## First Launch Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Supabase project created
- [ ] Environment variables configured (`.env` or `app.json`)
- [ ] Database schema run (`supabase/schema.sql`)
- [ ] Seed data inserted (`supabase/seed.sql`)
- [ ] Expo server started (`npm start`)
- [ ] App opened on device/simulator

Once all checkboxes are done, you should see the Welcome screen! 🎉

