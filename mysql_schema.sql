-- =========================================================================
--   SIMETRI PRO - LOCALHOST XAMPP MYSQL / MARIADB DATABASE SCHEMA
-- =========================================================================
-- Deskripsi: File SQL ini merupakan blueprint versi MySQL / MariaDB untuk dicoba di XAMPP lokal.
--            Kompatibel penuh untuk di-import langsung melalui phpMyAdmin.
-- Cara Menggunakan: 
--   1. Buka XAMPP, aktifkan module "Apache" dan "MySQL".
--   2. Buka browser, akses "http://localhost/phpmyadmin/".
--   3. Buat database baru bernama, misalnya: "db_simetri".
--   4. Pilih database tersebut, buka tab "Import", pilih file "mysql_schema.sql" ini, lalu klik "Go/Import".
-- =========================================================================

-- Matikan pemeriksaan foreign key sementara agar proses drop & create tabel mulus
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `visitor_logs`;
DROP TABLE IF EXISTS `websites`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ─── 1. TABEL PENGGUNA ADMINISTRATOR (users) ───
CREATE TABLE `users` (
    `id` VARCHAR(36) NOT NULL,
    `username` VARCHAR(100) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL, -- Menyimpan sandi (plain-text / MD5)
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indeks Pencarian Username Cepat
CREATE INDEX `idx_users_username` ON `users` (`username`);


-- ─── 2. TABEL WEBSITE BUILDER TEMPLATE (websites) ───
CREATE TABLE `websites` (
    `id` VARCHAR(36) NOT NULL,
    `app_id` VARCHAR(50) NOT NULL UNIQUE, -- ID Kustom (misal: site_5ccdo8)
    `site_name` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) DEFAULT 'draft',
    `owner` VARCHAR(100) NOT NULL,
    `pages_json` JSON DEFAULT NULL, -- Tipe data JSON Native MySQL 5.7+ / MariaDB
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_websites_owner` FOREIGN KEY (`owner`) 
        REFERENCES `users` (`username`) 
        ON UPDATE CASCADE 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indeks Kecepatan Query Web Builder
CREATE INDEX `idx_websites_app_id` ON `websites` (`app_id`);
CREATE INDEX `idx_websites_owner` ON `websites` (`owner`);
CREATE INDEX `idx_websites_status` ON `websites` (`status`);


-- ─── 3. TABEL LOG PENGUNJUNG REAL-TIME (visitor_logs) ───
CREATE TABLE `visitor_logs` (
    `site_id` VARCHAR(36) NOT NULL,
    `visitor_id` VARCHAR(255) NOT NULL,
    `last_seen` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`site_id`, `visitor_id`),
    CONSTRAINT `fk_visitor_logs_site` FOREIGN KEY (`site_id`) 
        REFERENCES `websites` (`id`) 
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Indeks Pemantauan Statistik Hits 5 Menit Terakhir
CREATE INDEX `idx_visitor_logs_site_seen` ON `visitor_logs` (`site_id`, `last_seen`);


-- ─── 4. DATA AWAL (SEED DATA / INITIAL SETUPS) ───

-- A. Membuat Akun Admin Utama Default (Username: admin, Password: bpomsamarinda)
INSERT INTO `users` (`id`, `username`, `password`)
VALUES ('32524a87-eaeb-4be3-b714-bc4870f7d542', 'admin', 'bpomsamarinda')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- B. Membuat Contoh Website BBPOM Pertama (perisai_mahakam)
INSERT INTO `websites` (`id`, `app_id`, `site_name`, `status`, `owner`, `pages_json`)
VALUES (
    '8ca5fb73-8a3d-4cde-80df-8bf38f830d95', 
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
    }'
)
ON DUPLICATE KEY UPDATE `app_id`=`app_id`;
