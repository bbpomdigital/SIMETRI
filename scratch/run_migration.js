const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fexmeikmwcnfnvdxnpig.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZleG1laWttd2NuZm52ZHhucGlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NDA3MDIsImV4cCI6MjA5NDQxNjcwMn0.BSi0crj40npgF1uLDHQ3AZoD3G2uOQxjXl9AaHh5dAQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const legacyData = [
  {
    "app_id": "site_du8w0m",
    "site_name": "sertilink",
    "status": "published",
    "owner": "admin",
    "pages_json": {
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
        { "id": "icons-1", "type": "iconrow", "data": { "title": "LAYANAN UTAMA", "items": [{ "label": "Utama", "icon": "Home" }, { "label": "FAQ", "icon": "HelpCircle" }, { "label": "Sertilink", "icon": "Award" }] } },
        { "id": "footer-1", "type": "footer", "data": { "aboutTitle": "SERTILINK", "online": "150" } }
      ]
    }
  },
  {
    "app_id": "site_5ccdo8",
    "site_name": "testing",
    "status": "published",
    "owner": "admin",
    "pages_json": {
      "index": [
        { "id": "nav-1", "type": "navbar", "data": { "brand": "TESTING", "links": [] } },
        { "id": "hero-1", "type": "hero", "data": { "title": "Portal Layanan Terintegrasi", "subtitle": "Wujudkan Pelayanan Publik Berintegritas", "badge": "TESTING MODE" } },
        { "id": "footer-1", "type": "footer", "data": { "aboutTitle": "BBPOM SAMARINDA" } }
      ]
    }
  },
  {
    "app_id": "site_ow4tyy",
    "site_name": "kosong",
    "status": "draft",
    "owner": "admin",
    "pages_json": {
      "index": [
        { "id": "nav-1", "type": "navbar", "data": { "brand": "KOSONG", "links": [] } },
        { "id": "hero-1", "type": "hero", "data": { "title": "Solusi Bisnis Masa Depan", "subtitle": "Teknologi Terkini", "badge": "DRAFT" } },
        { "id": "footer-1", "type": "footer", "data": { "aboutTitle": "GLOBAL CORP" } }
      ]
    }
  }
];

async function migrate() {
  console.log("🚀 Memulai migrasi data...");
  
  for (const site of legacyData) {
    const { data, error } = await supabase
      .from('websites')
      .upsert(site, { onConflict: 'app_id' });
    
    if (error) {
      console.error(`❌ Gagal migrasi ${site.site_name}:`, error.message);
    } else {
      console.log(`✅ Berhasil migrasi: ${site.site_name}`);
    }
  }
  
  console.log("🏁 Migrasi selesai!");
}

migrate();
