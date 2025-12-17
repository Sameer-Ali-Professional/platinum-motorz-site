-- Create cars table for inventory management
CREATE TABLE IF NOT EXISTS public.cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  mileage INTEGER NOT NULL,
  fuel_type TEXT,
  transmission TEXT,
  body_type TEXT,
  engine_size TEXT,
  color TEXT,
  doors INTEGER,
  description TEXT,
  features TEXT[],
  images TEXT[],
  autotrader_id TEXT UNIQUE,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Public can read available cars
CREATE POLICY "cars_select_available"
  ON public.cars FOR SELECT
  USING (is_available = true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_make ON public.cars(make);
CREATE INDEX IF NOT EXISTS idx_cars_price ON public.cars(price);
CREATE INDEX IF NOT EXISTS idx_cars_mileage ON public.cars(mileage);
CREATE INDEX IF NOT EXISTS idx_cars_year ON public.cars(year);
CREATE INDEX IF NOT EXISTS idx_cars_autotrader_id ON public.cars(autotrader_id);
CREATE INDEX IF NOT EXISTS idx_cars_available ON public.cars(is_available, created_at DESC);
