# Autotrader Sync Error Fix

## Common Issues

### 1. Playwright Not Available on Vercel
**Error:** "Playwright browser not available" or "chromium not found"

**Solution:** Playwright requires special setup for serverless environments. For Vercel, you have two options:

**Option A: Use Vercel's Serverless Functions with Playwright**
- Add `@sparticuz/chromium` package (serverless-compatible Chromium)
- Update scraper to use serverless Chromium

**Option B: Use External Scraping Service**
- Use a service like ScrapingBee, ScraperAPI, or Browserless
- Or run scraping on a separate server/worker

### 2. Timeout Issues
**Error:** "Request timed out"

**Solution:** Increase timeout in scraper or use a faster scraping method.

### 3. Storage Bucket Not Created
**Error:** "Bucket not found" or storage errors

**Solution:** Make sure you ran `scripts/005_create_storage_bucket.sql` in Supabase.

## Quick Fix: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Check the logs for `/api/admin/autotrader/sync`
3. Look for the specific error message

## Alternative: Manual Test

You can test the scraper locally first to see if it works:
1. The scraper should work locally if Playwright is installed
2. Check if it can access the Autotrader URL
3. Verify the page structure hasn't changed

