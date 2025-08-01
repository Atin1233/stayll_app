# Google Sign-In Setup Guide

## Overview
This guide will help you set up Google Sign-In with Supabase to solve the localhost redirect issue and provide a better user experience.

## Benefits of Google Sign-In
- ✅ **No more localhost redirect issues** - Google handles the OAuth flow
- ✅ **Better user experience** - One-click sign-in
- ✅ **More secure** - No password management needed
- ✅ **Higher conversion rates** - Reduces friction during sign-up

## Step 1: Set up Google OAuth in Google Cloud Console

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API** (if not already enabled)

### 1.2 Create OAuth 2.0 Credentials
1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client IDs**
3. Choose **Web application** as the application type
4. Set the following:
   - **Name**: `Stayll Web App`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://your-domain.vercel.app` (for production)
   - **Authorized redirect URIs**:
     - `https://your-project-ref.supabase.co/auth/v1/callback`
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Supabase

### 2.1 Enable Google Provider
1. Go to your **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click **Enable**
4. Enter your Google **Client ID** and **Client Secret**
5. Set **Redirect URL** to: `https://your-project-ref.supabase.co/auth/v1/callback`
6. Click **Save**

### 2.2 Configure Site URL (Optional)
1. In Supabase, go to **Authentication** → **Settings**
2. Set **Site URL** to your production URL: `https://your-domain.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-domain.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

## Step 3: Environment Variables

### 3.1 Local Development (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL (for development)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3.2 Production (Vercel)
Add these environment variables in your Vercel dashboard:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## Step 4: Test the Implementation

### 4.1 Development Testing
1. Run your app locally: `pnpm dev`
2. Go to `/signin` or `/signup`
3. Click "Sign In with Google"
4. Complete the Google OAuth flow
5. You should be redirected back to your app and signed in

### 4.2 Production Testing
1. Deploy your app to Vercel
2. Test the Google Sign-In flow in production
3. Verify that users are properly authenticated

## Step 5: User Data Handling

### 5.1 Accessing User Information
The Google Sign-In will provide user data in the following format:
```typescript
{
  id: string;
  email: string;
  user_metadata: {
    full_name: string;
    avatar_url: string;
    email_verified: boolean;
  };
}
```

### 5.2 Custom User Profiles
You can extend the user profile by creating a separate `profiles` table in Supabase:
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Troubleshooting

### Common Issues

#### 1. "Invalid redirect URI" Error
- **Cause**: Redirect URI doesn't match what's configured in Google Cloud Console
- **Solution**: Update the redirect URI in Google Cloud Console to match your Supabase callback URL

#### 2. "Client ID not found" Error
- **Cause**: Google Client ID is incorrect or not configured in Supabase
- **Solution**: Double-check the Client ID in Supabase Authentication settings

#### 3. "Origin not allowed" Error
- **Cause**: Your domain is not in the authorized origins list
- **Solution**: Add your domain to the authorized JavaScript origins in Google Cloud Console

#### 4. Authentication State Not Persisting
- **Cause**: Missing or incorrect Supabase configuration
- **Solution**: Verify your Supabase URL and anon key are correct

### Debug Steps
1. Check browser console for errors
2. Verify environment variables are set correctly
3. Test with a different browser or incognito mode
4. Check Supabase logs for authentication events

## Security Best Practices

### 1. Environment Variables
- Never commit sensitive keys to version control
- Use different keys for development and production
- Rotate keys regularly

### 2. Redirect URLs
- Always use HTTPS in production
- Validate redirect URLs on the server side
- Limit redirect URLs to your domains only

### 3. User Data
- Only request necessary scopes from Google
- Validate user data before storing
- Implement proper data deletion procedures

## Next Steps

1. **Customize the UI** - Add Google branding to the sign-in button
2. **Add user profiles** - Create a profile management system
3. **Implement role-based access** - Add different user roles
4. **Add analytics** - Track sign-in conversion rates
5. **Set up email notifications** - Welcome emails for new users

## Support

If you encounter issues:
1. Check the [Supabase Auth documentation](https://supabase.com/docs/guides/auth)
2. Review the [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2)
3. Check the browser console and Supabase logs for errors

---

**Your Google Sign-In is now ready! 🚀**

Users can now sign in with their Google accounts without any localhost redirect issues. 