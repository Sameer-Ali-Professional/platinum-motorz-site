# Autotrader Ingest System - Implementation Summary

## ✅ What Was Built

A complete Autotrader scraping and sync system that:

1. **Scrapes live listings** from your Autotrader dealer page
2. **Extracts car data** (make, model, year, price, mileage, etc.)
3. **Preserves image order** from DOM (exact order as displayed on Autotrader)
4. **Uploads images** to Supabase Storage
5. **Upserts to database** using `autotrader_id` as unique key
6. **Updates site dynamically** - no redeploys needed

## 📁 Files Created/Modified

### New Files
- `lib/autotrader/scraper.ts` - Playwright-based web scraper
- `lib/autotrader/image-uploader.ts` - Supabase Storage upload service
- `lib/autotrader/types.ts` - TypeScript interfaces
- `scripts/005_create_storage_bucket.sql` - Storage bucket setup
- `scripts/006_add_image_ordering.sql` - Schema updates
- `AUTOTRADER_SETUP.md` - Setup instructions
- `.vercelignore` - Exclude Playwright browsers from Vercel

### Modified Files
- `package.json` - Added `playwright` and `cheerio` dependencies
- `app/api/admin/autotrader/sync/route.ts` - Complete rewrite with real scraping
- `next.config.mjs` - Added image domain patterns for Supabase and Autotrader

## 🔄 Data Flow

```
Autotrader Dealer Page
    ↓
Playwright Scraper (lib/autotrader/scraper.ts)
    ↓
Extract: Car Data + Images (DOM order preserved)
    ↓
Image Uploader (lib/autotrader/image-uploader.ts)
    ↓
Upload to Supabase Storage: car-images/{autotrader_id}/{index}.jpg
    ↓
Upsert to public.cars (app/api/admin/autotrader/sync/route.ts)
    ↓
Website Updates (30s auto-refresh on /stock page)
```

## 🎯 Key Features

### Image Order Preservation
- Images extracted in **exact DOM order** from Autotrader
- Stored as `TEXT[]` array in database (order = array index)
- Components already handle ordered arrays correctly:
  - `image-carousel.tsx` - Displays in array order
  - `car-card.tsx` - Uses first image (index 0)

### Supabase Storage
- Bucket: `car-images`
- Structure: `{autotrader_id}/{index}.{ext}`
- Public read access enabled
- Authenticated upload only

### Upsert Logic
- Uses `autotrader_id` as unique identifier
- Updates existing cars or creates new ones
- Preserves manual edits (if not synced)
- Tracks sync metadata: `sync_source`, `last_synced_at`

## 🚀 Setup Required

### 1. Run SQL Scripts in Supabase

**Storage Bucket:**
```sql
-- Run: scripts/005_create_storage_bucket.sql
```

**Schema Updates:**
```sql
-- Run: scripts/006_add_image_ordering.sql
```

### 2. Install Dependencies

```bash
pnpm install
npx playwright install chromium
```

### 3. Deploy to Vercel

The system will work on Vercel, but you may need to:
- Add `postinstall` script to install Playwright browsers
- Or use serverless-friendly alternative (see setup guide)

## 📊 How to Use

1. **Go to Admin Dashboard**: `/admin`
2. **Click "Sync with Autotrader"**
3. **Wait 2-5 minutes** (depending on number of listings)
4. **Check `/stock` page** - cars appear within 30 seconds

## 🔍 Technical Details

### Scraper Strategy
- **Primary**: Modern Autotrader selectors (`[data-testid="search-listing"]`)
- **Fallback 1**: Class-based selectors
- **Fallback 2**: Generic article/listing containers
- **Fallback 3**: Extract from car detail links

### Image Extraction
- Finds all `<img>` tags in listing card
- Tries multiple attributes: `data-src`, `data-lazy-src`, `src`
- Filters out placeholders, logos, icons
- Preserves DOM order (first image = index 0)

### Error Handling
- Continues processing if one listing fails
- Returns error summary in API response
- Logs detailed errors to console
- Falls back to original URLs if upload fails

## ⚠️ Important Notes

1. **Playwright on Vercel**: May need special configuration (see setup guide)
2. **Rate Limiting**: 500ms delay between image uploads
3. **Timeout**: 30s page load timeout (adjust if needed)
4. **Authentication**: Sync endpoint requires admin auth

## 🎨 No Component Changes Needed

The existing components already handle ordered images:
- ✅ `image-carousel.tsx` - Uses array index for navigation
- ✅ `car-card.tsx` - Uses `images[0]` for thumbnail
- ✅ Array order = display order (no sorting needed)

## 📝 Next Steps

1. Run SQL scripts in Supabase
2. Install dependencies locally
3. Test sync from admin dashboard
4. Deploy to Vercel (may need Playwright config)
5. Set up scheduled sync (optional)

## 🔗 Related Files

- **Setup Guide**: `AUTOTRADER_SETUP.md`
- **Technical Report**: `TECHNICAL_REPORT.md`
- **API Endpoint**: `app/api/admin/autotrader/sync/route.ts`

---

**Status**: ✅ Complete and ready for testing

