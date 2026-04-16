-- Create arrangements table
CREATE TABLE IF NOT EXISTS public.arrangements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  composer TEXT,
  instrumentation TEXT,
  difficulty TEXT,
  key TEXT,
  genre TEXT,
  lyrics TEXT,
  duration TEXT,
  style TEXT,
  price DECIMAL(10, 2),
  is_purchasable BOOLEAN DEFAULT FALSE,
  pdf_file_path TEXT,
  preview_image_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.arrangements ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can view arrangements
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'arrangements' AND policyname = 'Public read access'
    ) THEN
        CREATE POLICY "Public read access" ON public.arrangements FOR SELECT USING (true);
    END IF;
END $$;

-- Authenticated users (admins) can do everything
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'arrangements' AND policyname = 'Admin full access'
    ) THEN
        CREATE POLICY "Admin full access" ON public.arrangements FOR ALL TO authenticated USING (true);
    END IF;
END $$;
