# Fix: Supabase Redirecting to Localhost on Production

## Problem
When testing on production (`https://www.platinummotorz.co.uk`), Supabase redirects to `http://localhost:3000/auth/callback` instead of the production URL.

## Root Cause
The **Site URL** in Supabase is set to `http://localhost:3000`, so Supabase uses that as the default redirect URL even when the OAuth flow starts from production.

## Solution

### Update Supabase Site URL

1. Go to: https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/auth/url-configuration
2. Change **Site URL** from `http://localhost:3000` to:
   - `https://www.platinummotorz.co.uk/auth/callback`
3. Click **Save changes**

### Keep Redirect URLs

Make sure you still have both redirect URLs:
- `http://localhost:3000/auth/callback` (for local development)
- `https://www.platinummotorz.co.uk/auth/callback` (for production)

The Site URL is used as the default when no specific redirect is provided, but the Redirect URLs list allows both local and production to work.

## After Update

Once you update the Site URL to production, GitHub sign-in on the production site will redirect to:
- `https://www.platinummotorz.co.uk/auth/callback?code=...`

Instead of:
- `http://localhost:3000/auth/callback?code=...`

