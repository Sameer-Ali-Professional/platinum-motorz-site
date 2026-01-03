# Autotrader Ingest Setup Guide

## Overview
This system scrapes live car listings from your Autotrader dealer page, uploads images to Supabase Storage, and syncs data to your website dynamically (no redeploys required).

## Prerequisites

1. **Supabase Storage Bucket** - Must be created first
2. **Environment Variables** - Already configured
3. **Dependencies** - Will be installed

## Setup Steps

### Step 1: Create Supabase Storage Bucket

Run this SQL in Supabase SQL Editor:
**File:** `scripts/005_create_storage_bucket.sql`

Go to: https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/sql/new

Copy and paste the entire contents of `scripts/005_create_storage_bucket.sql` and click "Run".

### Step 2: Update Database Schema

Run this SQL to add sync metadata:
**File:** `scripts/006_add_image_ordering.sql`

Go to: https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/sql/new

Copy and paste the entire contents of `scripts/006_add_image_ordering.sql` and click "Run".

### Step 3: Install Dependencies

```bash
pnpm install
```

This will install:
- `playwright` - For web scraping
- `cheerio` - For HTML parsing (backup)

### Step 4: Install Playwright Browsers

```bash
npx playwright install chromium
```

### Step 5: Test the Sync

1. Go to your admin dashboard: `/admin`
2. Click "Sync with Autotrader"
3. Wait for the sync to complete (may take 2-5 minutes depending on number of listings)

## How It Works

### Data Flow

```
Autotrader Dealer Page
    ↓ (Playwright Scraper)
Extract Car Data + Images (DOM order)
    ↓
Upload Images to Supabase Storage
    ↓
Upsert to public.cars table
    ↓
Website Updates Automatically (30s polling)
```

### Key Features

1. **DOM Order Preservation**: Images are extracted in the exact order they appear on Autotrader
2. **Supabase Storage**: All images uploaded to `car-images` bucket
3. **Upsert Logic**: Updates existing cars or creates new ones based on `autotrader_id`
4. **No Redeploys**: Changes appear on site within 30 seconds (automatic refresh)

### File Structure

- `lib/autotrader/scraper.ts` - Web scraping logic
- `lib/autotrader/image-uploader.ts` - Supabase Storage upload
- `app/api/admin/autotrader/sync/route.ts` - Main sync endpoint
- `scripts/005_create_storage_bucket.sql` - Storage setup
- `scripts/006_add_image_ordering.sql` - Schema updates

## Configuration

The dealer URL is configured in:
`app/api/admin/autotrader/sync/route.ts` (line 6)

```typescript
const AUTOTRADER_DEALER_URL = "https://www.autotrader.co.uk/dealers/lancashire/oldham/platinum-motorz-10047725"
```

## Troubleshooting

### No Listings Found

- Check if Autotrader page structure has changed
- Verify the dealer URL is correct
- Check browser console for scraping errors

### Image Upload Fails

- Verify Supabase Storage bucket exists
- Check bucket permissions (should be public read)
- Verify environment variables are set

### Sync Timeout

- Increase timeout in scraper if you have many listings
- Consider processing in batches

## Scheduled Sync (Optional)

To run automatically, you can:

1. **Vercel Cron Job**: Add to `vercel.json`
2. **External Cron**: Use a service like cron-job.org
3. **Manual**: Use admin dashboard button

### Vercel Deployment Note

Playwright requires Chromium to be installed. For Vercel deployments:

1. Add to `package.json` scripts:
   ```json
   "postinstall": "npx playwright install chromium"
   ```

2. Or use Vercel's build settings to install browsers

3. **Alternative**: Consider using a serverless-friendly scraper (like Puppeteer with @sparticuz/chromium) for production

## Notes

- Images are stored in Supabase Storage: `car-images/{autotrader_id}/{index}.jpg`
- Array order in `images TEXT[]` field preserves DOM order
- Cars are marked as `sync_source: 'autotrader'` for tracking
- `last_synced_at` timestamp tracks when each car was last updated

