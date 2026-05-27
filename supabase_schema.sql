-- =========================================================================
--   SIMETRI PRO - SUPABASE POSTGRESQL DATABASE SCHEMA MIGRATION SCRIPT
-- =========================================================================
-- Deskripsi: File SQL ini merupakan blueprint lengkap untuk database Supabase Anda.
--            Berisi definisi tabel, relasi (foreign key), optimasi indeks, dan seed data awal.
-- Cara Menggunakan: Salin seluruh isi file ini, lalu tempelkan (paste) ke 
--                  "SQL Editor" di Dashboard Supabase Anda, lalu klik "Run".
-- =========================================================================

-- ─── 1. MATIKAN & BERSIHKAN TABEL LAMA JIKA ADA (OPSIONAL / AMAN) ───
-- DROP TABLE IF EXISTS public.visitor_logs CASCADE;
-- DROP TABLE IF EXISTS public.websites CASCADE;
-- DROP TABLE IF EXISTS public.users CASCADE;

-- ─── 2. TABEL PENGGUNA ADMINISTRATOR (users) ───
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Kata sandi tersimpan (plain-text atau hashing)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeks Keamanan & Kecepatan Login
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);


-- ─── 3. TABEL WEBSITE BUILDER TEMPLATE (websites) ───
CREATE TABLE IF NOT EXISTS public.websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_id VARCHAR(50) UNIQUE NOT NULL, -- ID Unik Kustom (misal: site_5ccdo8)
    site_name VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    owner VARCHAR(100) NOT NULL REFERENCES public.users(username) ON UPDATE CASCADE ON DELETE CASCADE,
    pages_json JSONB DEFAULT '{}'::jsonb, -- Struktur halaman builder (JSON fleksibel)
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeks Pencarian & Query Kinerja Website
CREATE INDEX IF NOT EXISTS idx_websites_app_id ON public.websites(app_id);
CREATE INDEX IF NOT EXISTS idx_websites_owner ON public.websites(owner);
CREATE INDEX IF NOT EXISTS idx_websites_status ON public.websites(status);


-- ─── 4. TABEL LOG PENGUNJUNG REAL-TIME (visitor_logs) ───
CREATE TABLE IF NOT EXISTS public.visitor_logs (
    site_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    visitor_id VARCHAR(255) NOT NULL,
    last_seen TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (site_id, visitor_id)
);

-- Indeks Optimal untuk Menghitung Pengunjung Aktif 5 Menit Terakhir (Real-Time Stats)
CREATE INDEX IF NOT EXISTS idx_visitor_logs_site_seen ON public.visitor_logs(site_id, last_seen);


-- ─── 5. PANDUAN PENGATURAN BUCKET PENYIMPANAN MEDIA (SUPABASE STORAGE) ───
-- Catatan Keamanan: Unggahan gambar (preview & hero) disimpan di Supabase Storage.
-- Silakan buat bucket baru secara manual lewat Dashboard Supabase -> Storage dengan ketentuan:
--   - Nama Bucket: "uploads"
--   - Jenis: "Public" (diaktifkan agar gambar dapat diakses publik)
--   - Batas Ukuran File: 5MB
--   - Allowed MIME Types: image/* (hanya file gambar)


-- ─── 6. DATA AWAL (SEED DATA / INITIAL SETUPS) ───

-- A. Membuat Akun Admin Utama Default (Silakan ganti kata sandi demi keamanan!)
--    Username: admin
--    Password: admin123password
INSERT INTO public.users (username, password)
VALUES ('admin', 'bpomsamarinda')
ON CONFLICT (username) DO NOTHING;

-- B. Membuat Contoh Website BBPOM Pertama (perisai_mahakam)
INSERT INTO public.websites (app_id, site_name, status, owner, pages_json)
VALUES (
    'site_perisai', 
    'perisai_mahakam', 
    'published', 
    'admin',
    '{
      "index": [
        {
          "id": "nav-1",
          "type": "navbar",
          "data": {
            "brand": "PERISAI MAHAKAM",
            "links": [
              { "id": "l1", "label": "Utama", "url": "/" },
              { "id": "l2", "label": "Layanan", "url": "#layanan" }
            ]
          }
        },
        {
          "id": "hero-1",
          "type": "hero",
          "data": {
            "title": "Perisai Mahakam",
            "subtitle": "BBPOM Samarinda",
            "description": "Layanan Pengaduan & Layanan Informasi Terintegrasi BBPOM di Samarinda untuk Menjaga Keamanan Konsumen.",
            "badge": "SELAMAT DATANG",
            "backgroundImage": "/bbpom-samarinda.jpg"
          }
        },
        {
          "id": "footer-1",
          "type": "footer",
          "data": {
            "aboutTitle": "PERISAI MAHAKAM BBPOM SAMARINDA",
            "online": "0"
          }
        }
      ]
    }'::jsonb
)
ON CONFLICT (app_id) DO NOTHING;
