import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ovjowvzkfzzvzzvzzvzz.supabase.co'; // Diambil dari env nanti
const supabaseAnonKey = '...'; // Diambil dari env nanti

const legacyData = [
  {
    "appId": "site_du8w0m",
    "siteName": "sertilink",
    "status": "published",
    "data": {
      "index": [
        { "id": "nav-1", "type": "navbar", "data": { "brand": "Sertilink", "links": [{ "id": "l1", "label": "Home", "url": "/" }] } },
        { 
          "id": "hero-1", 
          "type": "hero", 
          "data": { 
            "title": "SERTILINK", 
            "subtitle": "Sertifikasi Layanan Terintegrasi Kolaborasi Akademisi Bisnis Government", 
            "description": "Membangun sinergi untuk pelayanan publik yang lebih baik.",
            "badge": "BBPOM SAMARINDA",
            "backgroundImage": "https://lh3.googleusercontent.com/d/1bqZxpUYJmCGLa1hAYBV6bSbNn7YRK3E0"
          } 
        },
        { "id": "footer-1", "type": "footer", "data": { "aboutTitle": "SERTILINK", "online": "150" } }
      ]
    }
  },
  {
    "appId": "site_5ccdo8",
    "siteName": "testing",
    "status": "published",
    "data": {
      "index": [
        { "id": "nav-1", "type": "navbar", "data": { "brand": "TESTING", "links": [] } },
        { "id": "hero-1", "type": "hero", "data": { "title": "Portal Layanan Terintegrasi", "subtitle": "Wujudkan Pelayanan Publik Berintegritas", "badge": "TESTING MODE" } },
        { "id": "footer-1", "type": "footer", "data": { "aboutTitle": "BBPOM SAMARINDA" } }
      ]
    }
  },
  {
    "appId": "site_ow4tyy",
    "siteName": "kosong",
    "status": "draft",
    "data": {
      "index": [
        { "id": "nav-1", "type": "navbar", "data": { "brand": "KOSONG", "links": [] } },
        { "id": "hero-1", "type": "hero", "data": { "title": "Solusi Bisnis Masa Depan", "subtitle": "Teknologi Terkini", "badge": "DRAFT" } },
        { "id": "footer-1", "type": "footer", "data": { "aboutTitle": "GLOBAL CORP" } }
      ]
    }
  }
];

async function migrate() {
  // Script ini akan dijalankan secara manual atau via internal tool
  console.log("Memulai migrasi...");
  // ... logika insert ke Supabase ...
}
