-- Create admin policies for reviews and cars management
-- Note: In production, you should have a proper admin user management system
-- For now, we'll allow authenticated users to manage reviews and cars

-- Admin can update and delete reviews
CREATE POLICY "reviews_update_admin"
  ON public.reviews FOR UPDATE
  USING (true);

CREATE POLICY "reviews_delete_admin"
  ON public.reviews FOR DELETE
  USING (true);

-- Admin can manage cars (insert, update, delete)
CREATE POLICY "cars_insert_admin"
  ON public.cars FOR INSERT
  WITH CHECK (true);

CREATE POLICY "cars_update_admin"
  ON public.cars FOR UPDATE
  USING (true);

CREATE POLICY "cars_delete_admin"
  ON public.cars FOR DELETE
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_cars_updated_at ON public.cars;
CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
