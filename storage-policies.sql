-- ============================================================
-- מדיניות Storage – הרץ אחרי יצירת bucket בשם listing-images
-- (Supabase Dashboard > Storage > Create bucket > "listing-images" > Public)
-- ============================================================

-- Allow anyone to upload to listing-images bucket
CREATE POLICY "allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'listing-images');

-- Allow anyone to read from listing-images bucket
CREATE POLICY "allow public reads" ON storage.objects
FOR SELECT USING (bucket_id = 'listing-images');

-- Allow anyone to delete their uploads
CREATE POLICY "allow public deletes" ON storage.objects
FOR DELETE USING (bucket_id = 'listing-images');
