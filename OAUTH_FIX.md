# OAuth Redirect Fix

## Issue
Supabase is redirecting to root (`/?code=...`) instead of `/auth/callback`.

## Solution

### Update Supabase Site URL

The **Site URL** in Supabase should match where you want OAuth to redirect by default.

1. Go to: https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/auth/url-configuration
2. Change **Site URL** from `http://localhost:3000` to:
   - **For local:** `http://localhost:3000/auth/callback`
   - **For production:** `https://www.platinummotorz.co.uk/auth/callback`

OR keep Site URL as is and ensure Redirect URLs include the callback paths (which you already have).

### Alternative: Check GitHub OAuth App

Make sure your GitHub OAuth App callback URL is:
- `https://rnqkrswffegqogylgueh.supabase.co/auth/v1/callback`

This is correct - GitHub should redirect to Supabase, then Supabase redirects to your app.

### Current Status

- ✅ Redirect URLs are correct: `/auth/callback` paths are configured
- ✅ Code has fallback handler on root page
- ⚠️ Site URL might need updating (optional, but can help)

The root page handler will catch `/?code=...` and redirect to `/auth/callback`, so it should work even if Supabase redirects to root.

