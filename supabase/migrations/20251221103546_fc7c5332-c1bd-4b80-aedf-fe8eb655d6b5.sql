-- Increase file size limit for meditation-audio bucket to 100MB
UPDATE storage.buckets 
SET file_size_limit = 104857600 
WHERE name = 'meditation-audio';

-- Also update breathing-audio bucket if it exists
UPDATE storage.buckets 
SET file_size_limit = 104857600 
WHERE name = 'breathing-audio';