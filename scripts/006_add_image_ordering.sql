-- Add image ordering support to cars table
-- This keeps images as TEXT[] but ensures order is preserved

-- Add sync metadata columns
ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS sync_source TEXT DEFAULT 'manual';

-- Create index for sync queries
CREATE INDEX IF NOT EXISTS idx_cars_sync_source ON public.cars(sync_source, last_synced_at);

-- Note: Image order is preserved by array order in PostgreSQL TEXT[]
-- The images array maintains DOM order from Autotrader scraping

