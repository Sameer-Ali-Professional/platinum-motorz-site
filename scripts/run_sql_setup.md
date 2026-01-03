# SQL Setup Instructions

## Quick Setup Guide

You need to run 2 SQL scripts in your Supabase dashboard. Follow these steps:

### Step 1: Create Storage Bucket

1. Go to: https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/sql/new
2. Open the file: `scripts/005_create_storage_bucket.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click "Run" (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

### Step 2: Add Sync Columns

1. Still in the SQL Editor (or open a new query)
2. Open the file: `scripts/006_add_image_ordering.sql`
3. Copy the entire contents
4. Paste into the SQL Editor
5. Click "Run"
6. You should see: "Success. No rows returned"

### Verify Setup

After running both scripts, verify:

1. **Storage Bucket Created:**
   - Go to: https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/storage/buckets
   - You should see a bucket named `car-images`

2. **Columns Added:**
   - Go to: https://supabase.com/dashboard/project/rnqkrswffegqogylgueh/editor
   - Click on `cars` table
   - You should see columns: `last_synced_at` and `sync_source`

## SQL Scripts Ready

Both SQL files are ready to copy-paste:
- ✅ `scripts/005_create_storage_bucket.sql`
- ✅ `scripts/006_add_image_ordering.sql`

