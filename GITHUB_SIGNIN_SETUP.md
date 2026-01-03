# GitHub Sign-In Setup Guide

## ✅ What Was Added

GitHub sign-in functionality has been added to both login and sign-up pages. You can now sign in with your GitHub account to access the admin dashboard.

## 🔧 Supabase Configuration Required

Before GitHub sign-in will work, you need to enable it in your Supabase dashboard:

### Step 1: Enable GitHub Provider in Supabase

1. Go to: https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/auth/providers
2. Find **GitHub** in the list of providers
3. Click **Enable**

### Step 2: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **New OAuth App** (or **OAuth Apps** → **New OAuth App**)
3. Fill in the form:
   - **Application name:** Platinum Motorz Admin
   - **Homepage URL:** `https://www.platinummotorz.co.uk`
   - **Authorization callback URL:** `https://rnqkrswffegqogylgueh.supabase.co/auth/v1/callback`
4. Click **Register application**
5. Copy the **Client ID** and generate a **Client Secret**

### Step 3: Add Credentials to Supabase

1. Back in Supabase dashboard → Auth → Providers → GitHub
2. Paste your **Client ID** and **Client Secret**
3. Click **Save**

### Step 4: Add Redirect URLs

1. Go to: https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/auth/url-configuration
2. Add to **Redirect URLs**:
   - `http://localhost:3000/admin`
   - `https://www.platinummotorz.co.uk/admin`
3. Click **Save**

## 🎨 UI Changes

### Login Page (`/auth/login`)
- Added "Or continue with" divider
- Added "Sign in with GitHub" button with GitHub icon
- Button styled with dark gray background (GitHub's color scheme)

### Sign-Up Page (`/auth/sign-up`)
- Added "Or continue with" divider
- Added "Sign up with GitHub" button with GitHub icon
- Same styling as login page

## 🔄 How It Works

1. User clicks "Sign in with GitHub" button
2. Supabase redirects to GitHub OAuth consent screen
3. User authorizes the application
4. GitHub redirects back to Supabase
5. Supabase redirects to `/admin` dashboard
6. User is automatically logged in

## ✅ Testing

1. Go to `/auth/login` or `/auth/sign-up`
2. Click "Sign in with GitHub" or "Sign up with GitHub"
3. You should be redirected to GitHub's authorization page
4. After authorizing, you should be redirected to `/admin`

## ⚠️ Important Notes

- **GitHub OAuth must be configured in Supabase** for this to work
- The callback URL in GitHub must match exactly: `https://rnqkrswffegqogylgueh.supabase.co/auth/v1/callback`
- Users signing in with GitHub will have their email automatically set from their GitHub account
- No password is required for GitHub sign-in users

## 🔗 Quick Links

- **Supabase Auth Providers:** https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/auth/providers
- **GitHub OAuth Apps:** https://github.com/settings/developers
- **Supabase URL Config:** https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/auth/url-configuration

---

**Status:** ✅ Code complete | ⏳ Waiting for Supabase GitHub OAuth configuration

