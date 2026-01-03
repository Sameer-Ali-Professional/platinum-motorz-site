# Platinum Motorz - Technical Architecture Report
**Generated:** 2025-12-17  
**Scope:** Car listings system, Supabase integration, image handling, and Autotrader compatibility

---

## 1. CAR LISTINGS: FETCH & RENDER ARCHITECTURE

### Current Implementation: **Fully Dynamic (Client-Side)**

**Stock Listing Page:**
- **File:** `app/stock/page.tsx`
- **Fetch Method:** Client-side `useEffect` hook
- **API Endpoint:** `GET /api/cars`
- **Polling:** Auto-refresh every 30 seconds (`setInterval`)
- **Filtering:** Client-side JavaScript (no server-side filtering)
- **Rendering:** React client component with state management

**Data Flow:**
```
Browser → /api/cars → Supabase Server Client → public.cars table → JSON Response → React State → UI Render
```

**Individual Car Detail Page:**
- **File:** `app/stock/[id]/page.tsx`
- **Fetch Method:** Client-side `useEffect` with dynamic route param
- **API Endpoint:** `GET /api/cars/[id]`
- **Rendering:** React client component

**API Routes:**
- **List Route:** `app/api/cars/route.ts` (Server Action)
- **Detail Route:** `app/api/cars/[id]/route.ts` (Server Action)
- **Both use:** `@/lib/supabase/server` for database queries

**Key Characteristics:**
- ✅ **No static generation** - All data fetched at runtime
- ✅ **No build-time dependencies** - Data changes appear immediately
- ✅ **Client-side filtering** - Filters applied in browser after fetch
- ⚠️ **No ISR/SSR** - No caching or pre-rendering

---

## 2. DATABASE ARCHITECTURE (SUPABASE)

### Tables

**`public.cars` Table:**
```sql
- id: UUID (PRIMARY KEY, auto-generated)
- make: TEXT (NOT NULL)
- model: TEXT (NOT NULL)
- year: INTEGER (NOT NULL)
- price: DECIMAL(10,2) (NOT NULL)
- mileage: INTEGER (NOT NULL)
- fuel_type: TEXT (nullable)
- transmission: TEXT (nullable)
- body_type: TEXT (nullable)
- engine_size: TEXT (nullable)
- color: TEXT (nullable)
- doors: INTEGER (nullable)
- description: TEXT (nullable)
- features: TEXT[] (array, nullable)
- images: TEXT[] (array, nullable) ⚠️ Currently stores file paths, not URLs
- autotrader_id: TEXT (UNIQUE, nullable) ✅ Already supports Autotrader
- is_available: BOOLEAN (DEFAULT true)
- created_at: TIMESTAMPTZ (auto)
- updated_at: TIMESTAMPTZ (auto, trigger-updated)
```

**Indexes:**
- `idx_cars_make`
- `idx_cars_price`
- `idx_cars_mileage`
- `idx_cars_year`
- `idx_cars_autotrader_id`
- `idx_cars_available` (composite: is_available + created_at DESC)

**Row Level Security (RLS):**
- ✅ Enabled on `public.cars`
- **Policy:** `cars_select_available` - Public can only SELECT where `is_available = true`
- **Admin Policies:** `cars_insert_admin`, `cars_update_admin`, `cars_delete_admin` (requires auth)

**`public.reviews` Table:**
- Separate table for customer reviews
- Not related to car listings directly

### Storage Buckets

**Current Status:** ❌ **NO SUPABASE STORAGE BUCKETS CONFIGURED**

- No storage bucket creation scripts found
- No storage client usage in codebase
- Images currently stored as static files in `/public/` directory

---

## 3. IMAGE HANDLING

### Current Implementation

**Storage Location:**
- **Static Files:** `/public/` directory (committed to Git)
- **Example Paths:** `/luxury-bmw-m5-competition.jpg`, `/luxury-audi-rs6-avant.jpg`
- **Total Images:** 12 car images + placeholders

**Database Storage:**
- **Field:** `images TEXT[]` (PostgreSQL array)
- **Current Format:** Array of file paths (e.g., `['/luxury-bmw-m5-competition.jpg']`)
- **Usage:**
  - Stock page: `car.images?.[0]` (first image only)
  - Detail page: `car.images || ["/luxury-car-sleek-design.png"]` (full array to carousel)

**Image Components:**
- **Car Card:** `components/car-card.tsx` - Uses `car.images?.[0]` (line 152)
- **Carousel:** `components/image-carousel.tsx` - Accepts `images: string[]` prop
- **Next.js Image:** Uses `<Image>` component with `fill` prop

**Next.js Config:**
- **File:** `next.config.mjs`
- **Setting:** `images: { unoptimized: true }` ⚠️ Image optimization disabled

### Image Ordering

**Current State:** ⚠️ **NO EXPLICIT ORDERING FIELD**

- Array order in `images TEXT[]` determines display order
- No `image_order` or `display_order` column
- No metadata for image captions/alt text
- Carousel displays in array sequence (index 0 = first)

---

## 4. DATA INSERTION POINTS

### Where New Car Data Should Plug In

**Option 1: Direct Supabase Insert (Recommended)**
- **Location:** Supabase Dashboard → Table Editor
- **File Reference:** `scripts/004_seed_sample_cars.sql` (example format)
- **No code changes required**
- **Immediate visibility:** Yes (30-second polling)

**Option 2: Admin Dashboard**
- **Component:** `components/admin-inventory-manager.tsx`
- **Location:** `/admin` page (requires authentication)
- **Method:** Uses Supabase client directly
- **Capabilities:** View, toggle availability, delete

**Option 3: API Endpoint (Autotrader)**
- **File:** `app/api/admin/autotrader/sync/route.ts`
- **Method:** `POST /api/admin/autotrader/sync`
- **Logic:** Upsert based on `autotrader_id`
- **Status:** ✅ Already implemented, needs real API integration

**Option 4: Manual SQL**
- **File:** `scripts/004_seed_sample_cars.sql` (template)
- **Run Location:** Supabase SQL Editor

**Minimal Refactor Required:**
- ✅ **No refactor needed** - All insertion methods work with existing schema
- ✅ **Image paths** can be updated in `images` array field
- ⚠️ **If switching to Supabase Storage:** Requires code changes (see Section 6)

---

## 5. REDEPLOY REQUIREMENTS

### When Redeploys Are Required

**❌ NO REDEPLOY NEEDED FOR:**
- Adding new cars to Supabase
- Updating car data (price, description, etc.)
- Changing `is_available` status
- Adding/removing images (if paths remain valid)
- Updating reviews

**✅ REDEPLOY REQUIRED FOR:**
- Code changes (components, API routes, pages)
- Environment variable changes (Supabase keys)
- Next.js config changes
- New dependencies
- Schema changes (if migrations needed)

**Why No Redeploy for Data:**
- All data fetching is **dynamic** (runtime)
- No static generation or build-time data dependencies
- API routes query Supabase at request time
- Client components fetch fresh data on mount + polling

**Current Polling:**
- Stock page refreshes every 30 seconds automatically
- Detail page fetches on route change
- No manual refresh needed

---

## 6. ORDERED IMAGE SUPPORT

### Current Limitations

**Missing Features:**
1. No explicit ordering field in database
2. No image metadata (alt text, captions, thumbnails)
3. Array order is implicit (relies on PostgreSQL array behavior)

### Required Changes for Ordered Images

**Database Schema Update:**
```sql
-- Option A: Add ordering column to cars table
ALTER TABLE public.cars 
ADD COLUMN image_order INTEGER[];

-- Option B: Create separate car_images table (normalized)
CREATE TABLE public.car_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES public.cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_car_images_car_id ON public.car_images(car_id, display_order);
```

**Code Changes Required:**
- **File:** `app/api/cars/route.ts` - Join with `car_images` table
- **File:** `app/api/cars/[id]/route.ts` - Include ordered images
- **File:** `components/image-carousel.tsx` - Sort by `display_order`
- **File:** `components/car-card.tsx` - Use primary image flag

**File Paths to Modify:**
1. `scripts/002_create_cars_table.sql` - Add schema migration
2. `app/api/cars/route.ts` - Update SELECT query
3. `app/api/cars/[id]/route.ts` - Update SELECT query
4. `components/car-card.tsx` - Update image selection logic
5. `components/image-carousel.tsx` - Add sorting logic

**If Using Supabase Storage:**
- Create storage bucket: `car-images`
- Upload images via Storage API
- Store public URLs in database
- Update `next.config.mjs` to allow Supabase image domains

---

## 7. AUTOTRADER INGEST SERVICE

### Existing Implementation

**API Route:**
- **File:** `app/api/admin/autotrader/sync/route.ts`
- **Method:** `POST`
- **Authentication:** Required (checks `supabase.auth.getUser()`)
- **Endpoint:** `/api/admin/autotrader/sync`

**Current Logic:**
```typescript
- Fetches from Autotrader API (currently simulated)
- Maps Autotrader fields to Supabase schema
- Uses upsert with onConflict: "autotrader_id"
- Updates existing cars or creates new ones
```

**Database Support:**
- ✅ `autotrader_id TEXT UNIQUE` field exists
- ✅ Index on `autotrader_id` for fast lookups
- ✅ Upsert logic prevents duplicates

### Conflicts & Risks Analysis

**✅ NO CONFLICTS IDENTIFIED:**

1. **Schema Compatibility:**
   - Autotrader route maps to existing `cars` table fields
   - All required fields (make, model, year, price, mileage) match
   - Optional fields (fuel_type, transmission, etc.) are nullable

2. **Data Integrity:**
   - `autotrader_id UNIQUE` constraint prevents duplicates
   - Upsert logic updates existing records (no data loss)
   - `is_available` flag allows soft-delete without removal

3. **Image Handling:**
   - Autotrader images stored in `images TEXT[]` array (same format)
   - No conflict with current static image approach
   - Can mix Autotrader URLs with static file paths

4. **API Route Isolation:**
   - Separate endpoint (`/api/admin/autotrader/sync`)
   - Doesn't interfere with public `/api/cars` routes
   - Admin-only access (authentication required)

**⚠️ POTENTIAL RISKS:**

1. **Image URL Format:**
   - Autotrader may provide full URLs (e.g., `https://...`)
   - Current code expects relative paths (e.g., `/luxury-...`)
   - **Risk Level:** Low - Next.js Image component handles both
   - **Mitigation:** Update `next.config.mjs` to allow external domains

2. **Field Mapping:**
   - Autotrader uses `fuelType` (camelCase)
   - Database uses `fuel_type` (snake_case)
   - **Status:** ✅ Already handled in sync route (line 67)

3. **Missing Fields:**
   - Autotrader may not provide all fields (e.g., `features`, `description`)
   - **Risk Level:** Low - All fields are nullable except core ones
   - **Mitigation:** Provide defaults or leave null

4. **Concurrent Updates:**
   - Manual edits in admin dashboard vs. Autotrader sync
   - **Risk Level:** Medium - Last sync wins
   - **Mitigation:** Add `last_synced_at` timestamp, preserve manual edits

**Recommended Enhancements:**
```sql
-- Add sync metadata
ALTER TABLE public.cars 
ADD COLUMN last_synced_at TIMESTAMPTZ,
ADD COLUMN sync_source TEXT DEFAULT 'manual';
```

---

## 8. SUMMARY & RECOMMENDATIONS

### Current State
- ✅ **Dynamic data fetching** - No redeploy needed for data changes
- ✅ **Supabase integration** - Fully functional
- ✅ **Autotrader support** - Schema and route ready
- ⚠️ **Static images** - No Supabase Storage yet
- ⚠️ **No image ordering** - Relies on array sequence

### File Paths Summary

**Core Files:**
- `app/stock/page.tsx` - Stock listing page
- `app/stock/[id]/page.tsx` - Car detail page
- `app/api/cars/route.ts` - List API
- `app/api/cars/[id]/route.ts` - Detail API
- `components/car-card.tsx` - Car card component
- `components/image-carousel.tsx` - Image carousel
- `components/admin-inventory-manager.tsx` - Admin interface
- `app/api/admin/autotrader/sync/route.ts` - Autotrader sync

**Database Scripts:**
- `scripts/002_create_cars_table.sql` - Schema
- `scripts/003_create_admin_policies.sql` - RLS policies
- `scripts/004_seed_sample_cars.sql` - Example data

**Configuration:**
- `next.config.mjs` - Next.js config (images unoptimized)
- `lib/supabase/server.ts` - Server client
- `lib/supabase/client.ts` - Browser client
- `middleware.ts` - Auth middleware

### Next Steps for Production

1. **Image Storage Migration (Optional):**
   - Create Supabase Storage bucket
   - Migrate images from `/public/` to Storage
   - Update `images` field to store Storage URLs

2. **Image Ordering (Recommended):**
   - Add `display_order` or separate `car_images` table
   - Update API routes to sort by order
   - Update components to respect ordering

3. **Autotrader Integration:**
   - Replace simulated data with real API calls
   - Add error handling and retry logic
   - Add sync scheduling (cron job)

4. **Performance Optimization:**
   - Consider ISR for stock page (revalidate every 60s)
   - Add image optimization back (update `next.config.mjs`)
   - Implement proper caching headers

---

**Report End**

