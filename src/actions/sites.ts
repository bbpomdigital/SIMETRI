'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabase-admin';

export interface SiteData {
  id: string;
  app_id: string;
  site_name: string;
  status: 'draft' | 'published';
  owner: string;
  pages_json: any;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  if (!token) return null;
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', token.value)
    .single();
    
  if (error || !data) return null;
  return data;
}

export async function getAllSites() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('owner', user.username)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as SiteData[];
}

export async function createNewSite(siteName: string, templateId: string = 'empty') {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const appId = 'site_' + Math.random().toString(36).substr(2, 6);
  
  // Define default structure based on template
  let defaultPagesJson: any = {
    index: [
      { id: 'nav-1', type: 'navbar', data: { brand: siteName, links: [{ id: 'l1', label: 'Utama', url: '/' }] } } as any,
      { id: 'hero-1', type: 'hero', data: { title: siteName, subtitle: 'Slogan Website Anda Disini', description: 'Deskripsi singkat tentang layanan atau profil organisasi Anda.', badge: 'SELAMAT DATANG', backgroundImage: '/bbpom-samarinda.jpg' } } as any,
      { id: 'footer-1', type: 'footer', data: { aboutTitle: siteName, online: '0' } } as any
    ]
  };

  if (templateId === 'perisai') {
    defaultPagesJson = {
      index: [
        { id: 'nav-1', type: 'navbar', data: { brand: 'SIMETRI', links: [{ id: 'l1', label: 'Utama', url: '/' }, { id: 'l2', label: 'FAQ', url: '/faq' }] } } as any,
        { id: 'hero-1', type: 'hero', data: { title: 'Simetri', subtitle: 'Sistem Manajemen Template Website Terintegrasi', description: 'Dapatkan seluruh informasi tentang BBPOM di Samarinda disini', badge: 'BBPOM DI SAMARINDA', backgroundImage: '/bbpom-samarinda.jpg' } } as any,
        { id: 'icons-1', type: 'iconrow', data: { title: 'LAYANAN UTAMA', items: [{ label: 'Utama', icon: 'Home' }, { label: 'FAQ', icon: 'HelpCircle' }, { label: 'Sertilink', icon: 'Award' }] } } as any,
        { id: 'values-1', type: 'values', data: { items: [{ title: 'Profesional', description: 'Menegakkan profesionalisme...', icon: 'Shield' }, { title: 'Integritas', description: 'Menjunjung tinggi konsistensi...', icon: 'CheckCircle' }] } } as any,
        { id: 'footer-1', type: 'footer', data: { aboutTitle: 'BBPOM DI SAMARINDA', online: '25' } } as any
      ]
    };
  }

  const { data, error } = await supabase
    .from('websites')
    .insert([{
      app_id: appId,
      site_name: siteName,
      pages_json: defaultPagesJson,
      status: 'draft',
      owner: user.username // Set owner secara dinamis ke user yang membuat
    }])
    .select()
    .single();

  if (error) throw error;
  
  revalidatePath('/admin');
  return { success: true, site: data };
}

export async function deleteSite(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase
    .from('websites')
    .delete()
    .eq('id', id)
    .eq('owner', user.username); // Proteksi kepemilikan ketat

  if (error) throw error;
  
  revalidatePath('/admin');
  return { success: true };
}

export async function updateSiteData(id: string, updates: Partial<SiteData>) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Unauthorized');

  // Proteksi override hak milik
  delete updates.owner;
  delete updates.id;

  const { error } = await supabase
    .from('websites')
    .update(updates)
    .eq('id', id)
    .eq('owner', user.username); // Proteksi kepemilikan ketat

  if (error) throw error;
  
  revalidatePath('/admin');
  revalidatePath(`/admin/edit/${id}`);
  return { success: true };
}

export async function getSiteById(idOrAppId: string) {
  // Cek apakah parameter input adalah UUID yang valid
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrAppId);

  let query = supabase.from('websites').select('*');
  if (isUuid) {
    query = query.or(`id.eq.${idOrAppId},app_id.eq.${idOrAppId}`);
  } else {
    query = query.eq('app_id', idOrAppId);
  }

  const { data, error } = await query.maybeSingle();

  if (error || !data) return null;
  return data as SiteData;
}

export async function getSiteByIdForEditor(id: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('websites')
    .select('*')
    .eq('id', id)
    .eq('owner', user.username)
    .single();

  if (error) return null;
  return data as SiteData;
}

export async function recordHit(siteId: string, visitorId: string) {
  try {
    // Cek apakah siteId adalah UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(siteId);
    let resolvedSiteId = siteId;

    if (!isUuid) {
      // Jika siteId adalah app_id kustom (seperti site_5ccdo8), cari UUID aslinya dari database
      const { data: site } = await supabase
        .from('websites')
        .select('id')
        .eq('app_id', siteId)
        .maybeSingle();
      
      if (site) {
        resolvedSiteId = site.id;
      }
    }

    // Layer 1: Coba dengan tabel visitor_logs resmi
    const { error } = await supabaseAdmin
      .from('visitor_logs')
      .upsert({ 
        site_id: resolvedSiteId, 
        visitor_id: visitorId, 
        last_seen: new Date().toISOString() 
      }, { onConflict: 'site_id, visitor_id' });
      
    if (!error) return { success: true };
    
    // Jika tabel tidak ditemukan, langsung gunakan Layer 2 (JSON Fallback)
    if (error.code === 'PGRST205' || error.message?.includes('visitor_logs')) {
      return await recordHitJsonFallback(resolvedSiteId, visitorId);
    }
    return { success: false };
  } catch (e) {
    return { success: false };
  }
}

async function recordHitJsonFallback(siteId: string, visitorId: string) {
  try {
    const { data: site, error: fetchErr } = await supabaseAdmin
      .from('websites')
      .select('*')
      .eq('id', siteId)
      .single();
      
    if (fetchErr || !site) return { success: false };

    let pagesJson = site.pages_json || {};
    if (!pagesJson.stats) {
      pagesJson.stats = { total: 0, visitors: {} };
    }
    
    const stats = pagesJson.stats;
    const visitors = stats.visitors || {};
    
    if (!visitors[visitorId]) {
      stats.total = (stats.total || 0) + 1;
    }
    
    visitors[visitorId] = new Date().toISOString();
    
    // Bersihkan sesi aktif yang lebih dari 5 menit agar ukuran JSON tetap sangat kecil
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const vid in visitors) {
      if (new Date(visitors[vid]).getTime() < fiveMinutesAgo) {
        delete visitors[vid];
      }
    }
    
    stats.visitors = visitors;
    pagesJson.stats = stats;

    const { error: updateErr } = await supabaseAdmin
      .from('websites')
      .update({ pages_json: pagesJson })
      .eq('id', siteId);

    return { success: !updateErr };
  } catch (e) {
    return { success: false };
  }
}

export async function getRealStats(siteId: string) {
  try {
    // Cek apakah siteId adalah UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(siteId);
    let resolvedSiteId = siteId;

    if (!isUuid) {
      const { data: site } = await supabase
        .from('websites')
        .select('id')
        .eq('app_id', siteId)
        .maybeSingle();
      
      if (site) {
        resolvedSiteId = site.id;
      }
    }

    // Layer 1: Coba dengan tabel visitor_logs resmi
    const { count: totalHits, error: err1 } = await supabaseAdmin
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .eq('site_id', resolvedSiteId);

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count: onlineCount, error: err2 } = await supabaseAdmin
      .from('visitor_logs')
      .select('*', { count: 'exact', head: true })
      .eq('site_id', resolvedSiteId)
      .gt('last_seen', fiveMinutesAgo);

    if (!err1 && !err2) {
      return {
        total: totalHits || 0,
        online: onlineCount || 0
      };
    }
    
    // Jika gagal, langsung beralih ke Layer 2
    return await getRealStatsJsonFallback(resolvedSiteId);
  } catch (e) {
    return { total: 0, online: 0 };
  }
}

async function getRealStatsJsonFallback(siteId: string) {
  try {
    const { data: site, error } = await supabaseAdmin
      .from('websites')
      .select('pages_json')
      .eq('id', siteId)
      .single();

    if (error || !site) return { total: 0, online: 0 };

    const pagesJson = site.pages_json || {};
    const stats = pagesJson.stats || { total: 0, visitors: {} };
    const visitors = stats.visitors || {};
    
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    let onlineCount = 0;
    for (const vid in visitors) {
      if (new Date(visitors[vid]).getTime() >= fiveMinutesAgo) {
        onlineCount++;
      }
    }

    return {
      total: stats.total || 0,
      online: onlineCount || 0
    };
  } catch (e) {
    return { total: 0, online: 0 };
  }
}
