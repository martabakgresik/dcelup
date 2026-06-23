CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS promos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  discount_value TEXT,
  valid_until DATETIME,
  is_active BOOLEAN DEFAULT 1
);

-- Default Settings
INSERT INTO settings (key, value) VALUES 
  ('header_title', 'D''CELUP'),
  ('header_subtitle', 'CHICKEN CRISPY'),
  ('header_slogan', 'LEZATNYA AYAM CRISPY BERBALUT SAUS PILIHAN'),
  ('footer_address', 'Jl. Mayjend Sungkono, RT. 07 RW. 01, Kel. Sukowinangun, Magetan'),
  ('whatsapp_number', '081615889790'),
  ('phone_number', '081615889790'),
  ('is_maintenance', 'false'),
  ('maintenance_message', 'Kami sedang dalam perbaikan. Silakan kembali lagi nanti.'),
  ('maintenance_end_time', '');
