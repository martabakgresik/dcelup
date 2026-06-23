DROP TABLE IF EXISTS menus;

CREATE TABLE menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Data (Daftar Menu Ayam)
INSERT INTO menus (category, name, price) VALUES 
  ('AYAM CRISPY', 'Ayam Original', 8000),
  ('AYAM CRISPY', 'Ayam Saus Sadis', 12000),
  ('AYAM CRISPY', 'Ayam Saus Barbeque', 12000),
  ('AYAM CRISPY', 'Ayam Saus Lada Hitam', 12000),
  ('AYAM CRISPY', 'Ayam Saus Teriyaki', 12000),
  ('AYAM CRISPY', 'Ayam Saus Keju', 12000);

-- Seed Data (Paket Nasi Ayam - Free Es Teh)
INSERT INTO menus (category, name, price) VALUES 
  ('PAKET NASI AYAM', 'Nasi Ayam Original', 12000),
  ('PAKET NASI AYAM', 'Nasi Ayam Saus Sadis', 15000),
  ('PAKET NASI AYAM', 'Nasi Ayam Saus Barbeque', 15000),
  ('PAKET NASI AYAM', 'Nasi Ayam Saus Lada Hitam', 15000),
  ('PAKET NASI AYAM', 'Nasi Ayam Saus Teriyaki', 15000),
  ('PAKET NASI AYAM', 'Nasi Ayam Saus Keju', 15000);

-- Seed Data (Extra)
INSERT INTO menus (category, name, price) VALUES 
  ('EXTRA', 'Extra Nasi', 4000),
  ('EXTRA', 'Extra Saus', 4000);
