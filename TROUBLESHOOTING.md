# Troubleshooting: GitHub Sign-In Button Not Showing

## Issue
The "Sign in with GitHub" button doesn't appear after refreshing the page.

## Solutions

### 1. Hard Refresh Browser
- **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`
- Or: Open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### 2. Restart Dev Server
```bash
# Stop the current server (Ctrl + C)
# Then restart:
pnpm dev
```

### 3. Clear Next.js Cache
```bash
# Delete .next folder
rm -rf .next
# Or on Windows:
Remove-Item -Recurse -Force .next

# Then restart:
pnpm dev
```

### 4. Check Browser Console
- Open DevTools (F12)
- Check Console tab for any errors
- Check Network tab to see if files are loading

### 5. Verify File Was Saved
- Make sure `app/auth/login/page.tsx` was saved
- The file should have the GitHub button code (lines 116-135)

## Quick Test
1. Open: http://localhost:3000/auth/login
2. You should see:
   - Email/password form
   - "Or continue with" divider
   - "Sign in with GitHub" button (dark gray button with GitHub icon)

If the button still doesn't appear after these steps, let me know!

