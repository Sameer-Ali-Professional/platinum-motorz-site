-- Add registration field to cars table
-- This field is admin-only and will not be displayed on public pages

ALTER TABLE public.cars 
ADD COLUMN IF NOT EXISTS registration TEXT;

-- Add comment to document that this field is admin-only
COMMENT ON COLUMN public.cars.registration IS 'Vehicle registration number (admin-only, not displayed on public site)';

