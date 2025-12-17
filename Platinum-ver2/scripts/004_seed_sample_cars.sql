-- Seed some sample cars for testing (using data from existing cars.json)
INSERT INTO public.cars (make, model, year, price, mileage, fuel_type, transmission, body_type, engine_size, color, doors, description, features, images, is_available)
VALUES
  ('Mercedes-Benz', 'S-Class', 2022, 89999.00, 12500, 'Petrol', 'Automatic', 'Sedan', '3.0L V6', 'Black', 4, 'Luxurious flagship sedan with cutting-edge technology and unparalleled comfort.', 
   ARRAY['Leather Seats', 'Navigation System', 'Panoramic Sunroof', 'Massage Seats', 'Ambient Lighting'], 
   ARRAY['/luxury-black-mercedes-s-class.jpg'], true),
  
  ('BMW', 'M5 Competition', 2023, 105000.00, 8900, 'Petrol', 'Automatic', 'Sedan', '4.4L V8', 'Alpine White', 4, 'High-performance luxury sedan with blistering acceleration and precision handling.',
   ARRAY['Carbon Fiber Trim', 'M Sport Exhaust', 'Adaptive Suspension', 'Head-Up Display', 'Premium Sound'],
   ARRAY['/luxury-bmw-m5-competition.jpg'], true),
  
  ('Audi', 'RS6 Avant', 2023, 112000.00, 6200, 'Petrol', 'Automatic', 'Estate', '4.0L V8', 'Nardo Grey', 5, 'The ultimate performance estate combining practicality with supercar performance.',
   ARRAY['Matrix LED Headlights', 'Sport Differential', 'Carbon Ceramic Brakes', 'Virtual Cockpit', 'Bang & Olufsen Sound'],
   ARRAY['/luxury-audi-rs6-avant.jpg'], true),
  
  ('Porsche', '911 Turbo S', 2022, 165000.00, 5100, 'Petrol', 'Automatic', 'Coupe', '3.8L Flat-6', 'Guards Red', 2, 'Iconic sports car with breathtaking performance and timeless design.',
   ARRAY['Sport Chrono Package', 'PASM Suspension', 'Rear-Axle Steering', 'Burmester Sound', 'Sports Exhaust'],
   ARRAY['/luxury-porsche-911-turbo.jpg'], true),
  
  ('Range Rover', 'Sport HSE', 2023, 95000.00, 9800, 'Diesel', 'Automatic', 'SUV', '3.0L I6', 'Santorini Black', 5, 'Luxury SUV with exceptional off-road capability and premium interior.',
   ARRAY['Air Suspension', 'Terrain Response', 'Meridian Sound', 'Panoramic Roof', 'Heated/Cooled Seats'],
   ARRAY['/luxury-range-rover-sport.jpg'], true),
  
  ('Lexus', 'LS 500', 2022, 79999.00, 15200, 'Hybrid', 'Automatic', 'Sedan', '3.5L V6', 'Sonic Silver', 4, 'Japanese luxury at its finest with hybrid efficiency and supreme comfort.',
   ARRAY['Mark Levinson Audio', 'Semi-Aniline Leather', 'Shiatsu Massage', 'Kiriko Glass Trim', 'Executive Package'],
   ARRAY['/luxury-lexus-ls-500.jpg'], true),
  
  ('Mercedes-AMG', 'GT', 2023, 135000.00, 4500, 'Petrol', 'Automatic', 'Coupe', '4.0L V8', 'Designo Selenite Grey', 2, 'Stunning performance coupe with race-bred technology and stunning looks.',
   ARRAY['AMG Track Pace', 'Performance Exhaust', 'AMG Ride Control', 'Nappa Leather', 'Carbon Fiber Accents'],
   ARRAY['/luxury-mercedes-amg-gt.jpg'], true),
  
  ('Bentley', 'Continental GT', 2022, 195000.00, 7800, 'Petrol', 'Automatic', 'Coupe', '6.0L W12', 'Beluga Black', 2, 'The pinnacle of British luxury and craftsmanship with incredible performance.',
   ARRAY['Naim Audio', 'Diamond Quilted Leather', 'Rotating Display', 'Ventilated Seats', 'Mulliner Specification'],
   ARRAY['/luxury-bentley-continental-gt.jpg'], true),
  
  ('Aston Martin', 'DB11', 2022, 175000.00, 6900, 'Petrol', 'Automatic', 'Coupe', '5.2L V12', 'Magnetic Silver', 2, 'British grand tourer with stunning design and exhilarating V12 power.',
   ARRAY['Bang & Olufsen BeoSound', 'Sports Plus Pack', 'Carbon Fiber Interior', 'Heated Seats', 'Premium Leather'],
   ARRAY['/luxury-aston-martin-db11.jpg'], true)
ON CONFLICT (id) DO NOTHING;
