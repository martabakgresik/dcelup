-- Add discount_type column to promos
ALTER TABLE promos ADD COLUMN discount_type TEXT DEFAULT 'nominal';
