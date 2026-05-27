import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// ── Resolve app_id ke UUID ──────────────────────────────────────────────────
async function resolveId(siteId: string): Promise<string> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(siteId);
  if (isUuid) return siteId;

  const { data } = await supabaseAdmin
    .from('websites')
    .select('id')
    .eq('app_id', siteId)
    .maybeSingle();

  return data?.id ?? siteId;
}

// ── POST /api/stats  →  Rekam kunjungan pengunjung ─────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { siteId, visitorId } = await req.json();
    if (!siteId || !visitorId) {
      return NextResponse.json({ success: false, error: 'Missing params' }, { status: 400 });
    }

    const resolvedId = await resolveId(siteId);

    const { error } = await supabaseAdmin
      .from('visitor_logs')
      .upsert(
        { site_id: resolvedId, visitor_id: visitorId, last_seen: new Date().toISOString() },
        { onConflict: 'site_id,visitor_id' }
      );

    if (error) {
      // Fallback: simpan di pages_json jika tabel visitor_logs belum ada
      return await jsonFallbackRecord(resolvedId, visitorId);
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// ── GET /api/stats?siteId=xxx  →  Ambil statistik ──────────────────────────
export async function GET(req: NextRequest) {
  try {
    const siteId = req.nextUrl.searchParams.get('siteId');
    if (!siteId) {
      return NextResponse.json({ total: 0, online: 0, error: 'Missing siteId' }, { status: 400 });
    }

    const resolvedId = await resolveId(siteId);
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    const [{ count: total, error: err1 }, { count: online, error: err2 }] = await Promise.all([
      supabaseAdmin
        .from('visitor_logs')
        .select('*', { count: 'exact', head: true })
        .eq('site_id', resolvedId),
      supabaseAdmin
        .from('visitor_logs')
        .select('*', { count: 'exact', head: true })
        .eq('site_id', resolvedId)
        .gt('last_seen', fiveMinutesAgo),
    ]);

    // Jika tabel visitor_logs belum ada, fallback ke JSON
    if (err1 || err2) {
      return await jsonFallbackGet(resolvedId);
    }

    return NextResponse.json({ total: total ?? 0, online: online ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ total: 0, online: 0, error: e.message }, { status: 500 });
  }
}

// ── Fallback: Statistik disimpan di pages_json ──────────────────────────────
async function jsonFallbackRecord(siteId: string, visitorId: string) {
  const { data: site, error } = await supabaseAdmin
    .from('websites')
    .select('pages_json')
    .eq('id', siteId)
    .single();

  if (error || !site) return NextResponse.json({ success: false });

  const pagesJson = site.pages_json ?? {};
  const stats = pagesJson.stats ?? { total: 0, visitors: {} };
  const visitors = stats.visitors ?? {};
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;

  // Tambah total jika pengunjung baru
  if (!visitors[visitorId]) {
    stats.total = (stats.total ?? 0) + 1;
  }
  visitors[visitorId] = new Date().toISOString();

  // Bersihkan sesi kedaluwarsa agar JSON tetap kecil
  for (const vid in visitors) {
    if (new Date(visitors[vid]).getTime() < fiveMinAgo) {
      delete visitors[vid];
    }
  }

  stats.visitors = visitors;
  pagesJson.stats = stats;

  await supabaseAdmin.from('websites').update({ pages_json: pagesJson }).eq('id', siteId);
  return NextResponse.json({ success: true });
}

async function jsonFallbackGet(siteId: string) {
  const { data: site, error } = await supabaseAdmin
    .from('websites')
    .select('pages_json')
    .eq('id', siteId)
    .single();

  if (error || !site) return NextResponse.json({ total: 0, online: 0 });

  const pagesJson = site.pages_json ?? {};
  const stats = pagesJson.stats ?? { total: 0, visitors: {} };
  const visitors = stats.visitors ?? {};
  const fiveMinAgo = Date.now() - 5 * 60 * 1000;

  let onlineCount = 0;
  for (const vid in visitors) {
    if (new Date(visitors[vid]).getTime() >= fiveMinAgo) onlineCount++;
  }

  return NextResponse.json({ total: stats.total ?? 0, online: onlineCount });
}
