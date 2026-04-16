-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('arrangements', 'arrangements', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('arrangement-previews', 'arrangement-previews', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for arrangements (private)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin can upload arrangements') THEN
        CREATE POLICY "Admin can upload arrangements" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'arrangements');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin can update arrangements') THEN
        CREATE POLICY "Admin can update arrangements" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'arrangements');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin can delete arrangements') THEN
        CREATE POLICY "Admin can delete arrangements" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'arrangements');
    END IF;
END $$;

-- Storage policies for arrangement-previews (public)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Public can view previews') THEN
        CREATE POLICY "Public can view previews" ON storage.objects FOR SELECT USING (bucket_id = 'arrangement-previews');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin can upload previews') THEN
        CREATE POLICY "Admin can upload previews" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'arrangement-previews');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin can update previews') THEN
        CREATE POLICY "Admin can update previews" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'arrangement-previews');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Admin can delete previews') THEN
        CREATE POLICY "Admin can delete previews" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'arrangement-previews');
    END IF;
END $$;
