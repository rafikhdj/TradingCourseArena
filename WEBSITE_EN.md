# 🌐 Create Required Web Pages for App Store Connect (English)

## 📋 Required Pages

To submit your app to the App Store, you need:

1. **Website URL** (required)
2. **Privacy Policy URL** (required)
3. **Support URL** (recommended)

## 🚀 Option 1: GitHub Pages (Free and Fast)

### Step 1: Create a New Repository

1. Go to: https://github.com/new
2. Create a new repo: `tradingcoursearena-website`
3. Check **"Public"** (for free GitHub Pages)
4. Click **"Create repository"**

### Step 2: Create the Files

Create these files in your new repo:

**`index.html`** (Main page):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TradingCourseArena - Training for Traders</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 { color: #0A0E27; }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background: #0A0E27;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>TradingCourseArena</h1>
    <h2>Training for Junior Traders</h2>
    
    <p>TradingCourseArena is the ultimate training app for junior traders preparing for interviews and real-time trading challenges.</p>
    
    <h3>Features</h3>
    <ul>
        <li>Infinite quiz with random questions</li>
        <li>Fast mental math</li>
        <li>Probability and brainteasers</li>
        <li>Detailed statistics</li>
        <li>Global leaderboard</li>
    </ul>
    
    <a href="https://apps.apple.com/app/tradingcoursearena" class="button">Download on the App Store</a>
    
    <h3>Contact</h3>
    <p>Email: [your-email@example.com]</p>
    
    <p><a href="/privacy.html">Privacy Policy</a></p>
</body>
</html>
```

**`privacy.html`** (Privacy policy):
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - TradingCourseArena</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 { color: #0A0E27; }
    </style>
</head>
<body>
    <h1>Privacy Policy - TradingCourseArena</h1>
    <p><em>Last Updated: January 15, 2026</em></p>
    
    <h2>Data Collection</h2>
    <p>TradingCourseArena collects only the data necessary for the app to function:</p>
    <ul>
        <li>Account information (email, encrypted password)</li>
        <li>Progress data (scores, statistics)</li>
        <li>Usage data (time spent, questions answered)</li>
    </ul>
    
    <h2>Use of Data</h2>
    <p>Your data is used only to improve your user experience and track your progress.</p>
    
    <h2>Data Storage</h2>
    <p>All data is stored securely on Supabase (secure cloud infrastructure).</p>
    
    <h2>Data Sharing</h2>
    <p>We do not share your personal data with third parties.</p>
    
    <h2>Your Rights</h2>
    <p>You can access your data, modify it, or delete your account at any time.</p>
    
    <h2>Contact</h2>
    <p>For any questions: [your-email@example.com]</p>
    
    <p><a href="/index.html">← Back to home</a></p>
</body>
</html>
```

### Step 3: Enable GitHub Pages

1. In your GitHub repo, go to **Settings** → **Pages**
2. Under **Source**, select **"main"** (or "master")
3. Click **"Save"**
4. Your site will be available at: `https://[your-username].github.io/tradingcoursearena-website`

### Step 4: URLs to Use

- **Website URL**: `https://[your-username].github.io/tradingcoursearena-website`
- **Privacy Policy URL**: `https://[your-username].github.io/tradingcoursearena-website/privacy.html`
- **Support URL**: `https://[your-username].github.io/tradingcoursearena-website` (or your email)

## 🚀 Option 2: Netlify (Free and Simple)

1. Go to: https://www.netlify.com
2. Create an account (free)
3. Create a new site
4. Drag and drop a folder with your HTML files
5. Your site will be available at: `https://[site-name].netlify.app`

## 🚀 Option 3: Use Existing Repo

If you prefer, you can add these files to your existing `TradingCourseArena` repo:

1. Create a `docs/` or `website/` folder
2. Add the HTML files
3. Enable GitHub Pages on this folder
4. URLs: `https://rafikhdj.github.io/TradingCourseArena/website/`

## ✅ Checklist

- [ ] Create the repository or folder
- [ ] Create `index.html`
- [ ] Create `privacy.html`
- [ ] Enable GitHub Pages / Netlify
- [ ] Test the URLs
- [ ] Update emails in the files
- [ ] Use the URLs in App Store Connect

## 📝 Notes

- GitHub Pages URLs may take a few minutes to be active
- You can use a custom domain name later
- Pages can be very simple - the important thing is that they exist and are accessible

---

**Once the pages are created, you can fill in all the information in App Store Connect!** 🎉
