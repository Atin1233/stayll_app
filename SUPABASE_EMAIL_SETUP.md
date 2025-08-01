# Supabase Email Template Setup Guide

## Problem
By default, Supabase sends confirmation links, not codes. We need to configure custom email templates to send 6-digit confirmation codes.

## Solution: Custom Email Templates

### Step 1: Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Email Templates**

### Step 2: Configure Confirmation Email Template

**Template Name:** `Confirm signup`

**Subject:** `Confirm your Stayll account - Code: {{ .Token }}`

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm your Stayll account</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .code { background: #3b82f6; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 4px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Stayll!</h1>
            <p>Confirm your account to get started</p>
        </div>
        <div class="content">
            <h2>Your confirmation code:</h2>
            <div class="code">{{ .Token }}</div>
            <p>Enter this 6-digit code in the Stayll app to confirm your account.</p>
            <p><strong>This code will expire in 1 hour.</strong></p>
            <p>If you didn't create a Stayll account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2025 Stayll Inc. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### Step 3: Configure Password Reset Email Template

**Template Name:** `Reset password`

**Subject:** `Reset your Stayll password - Code: {{ .Token }}`

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset your Stayll password</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .code { background: #ef4444; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 4px; }
        .button { display: inline-block; background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
            <p>Use this code to reset your Stayll password</p>
        </div>
        <div class="content">
            <h2>Your reset code:</h2>
            <div class="code">{{ .Token }}</div>
            <p>Enter this 6-digit code in the Stayll app to reset your password.</p>
            <p><strong>This code will expire in 1 hour.</strong></p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2025 Stayll Inc. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

### Step 4: Configure Email Settings

1. Go to **Authentication** → **Settings**
2. Under **Email Auth**, make sure:
   - **Enable email confirmations** is ON
   - **Enable secure email change** is ON
   - **Enable email change confirmations** is ON

### Step 5: Test the Setup

1. Try registering a new account
2. Check your email for the confirmation code
3. Enter the code in the app

## Alternative: Use Magic Links (Simpler)

If you prefer to keep it simple, we can switch back to magic links but make them work properly:

### Configure Magic Link Template

**Template Name:** `Magic Link`

**Subject:** `Sign in to Stayll`

**Email Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in to Stayll</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome back to Stayll!</h1>
            <p>Click the button below to sign in</p>
        </div>
        <div class="content">
            <p>You requested to sign in to your Stayll account.</p>
            <a href="{{ .ConfirmationURL }}" class="button">Sign In to Stayll</a>
            <p>If you didn't request this sign-in, you can safely ignore this email.</p>
        </div>
        <div class="footer">
            <p>© 2025 Stayll Inc. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
```

## Troubleshooting

### If emails aren't sending:
1. Check your Supabase project's email provider settings
2. Verify your domain is configured properly
3. Check the email logs in Supabase dashboard

### If codes aren't working:
1. Make sure the template uses `{{ .Token }}` (not `{{ .ConfirmationURL }}`)
2. Verify the template names match exactly
3. Check that email confirmations are enabled

## Next Steps

1. Set up the email templates in your Supabase dashboard
2. Test with a new account
3. Let me know if you need help with any of these steps! 