# Fix Localhost Redirect Issue

## Problem
When you receive authentication emails (magic links, confirmation links), they redirect to `localhost:3000` instead of your production URL.

## Solution

### Step 1: Add Environment Variable to Vercel

1. Go to your **Vercel Dashboard**
2. Select your **Stayll project**
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://your-actual-domain.vercel.app` (replace with your actual Vercel URL)
   - **Environment**: Production (and Preview if you want)

### Step 2: Get Your Vercel URL

Your Vercel URL will be something like:
- `https://stayll-app-atin1233.vercel.app`
- `https://stayll-app-git-main-atin1233.vercel.app`
- Or your custom domain if you have one

### Step 3: Configure Supabase (Alternative)

If the environment variable doesn't work, you can also configure this in Supabase:

1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Settings**
3. Under **Site URL**, enter your production URL
4. Under **Redirect URLs**, add:
   - `https://your-domain.vercel.app/auth/login`
   - `https://your-domain.vercel.app/auth/register`

### Step 4: Test the Fix

1. **Redeploy your app** (Vercel will automatically redeploy when you add environment variables)
2. **Try registering** with a new email
3. **Check the email** - the link should now point to your production URL

## How It Works

The app now uses a utility function that:
1. **Checks for `NEXT_PUBLIC_SITE_URL`** environment variable first
2. **Falls back to `window.location.origin`** for development
3. **Uses `localhost:3000`** as final fallback

This ensures that:
- **Development**: Uses localhost
- **Production**: Uses your actual domain
- **No more broken links** in authentication emails

## Troubleshooting

### If links still go to localhost:
1. **Check your environment variable** is set correctly in Vercel
2. **Redeploy the app** after adding the environment variable
3. **Clear your browser cache** and try again
4. **Check Supabase settings** as an alternative

### If you get a 404 error:
1. **Verify the URL** in the environment variable is correct
2. **Make sure the app is deployed** and accessible
3. **Check that the auth routes exist** (`/auth/login`, `/auth/register`)

## Example Environment Variable

```
NEXT_PUBLIC_SITE_URL=https://stayll-app-atin1233.vercel.app
```

Replace `stayll-app-atin1233.vercel.app` with your actual Vercel domain. 