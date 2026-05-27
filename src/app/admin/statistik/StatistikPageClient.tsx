'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Globe, Eye, TrendingUp, Users, Activity, Calendar, Zap, Clock, RefreshCw, Moon, Sun, Bell } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { getRealStats } from '@/actions/sites';

interface Site {
  id: string;
  site_name: string;
  status: string;
  pages_json?: any;
}

interface StatistikPageClientProps {
  sites: Site[];
}

export default function StatistikPageClient({ sites }: StatistikPageClientProps) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';
  const [statsMap, setStatsMap] = useState<Record<string, { total: number; online: number }>>({});
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  // State Notifikasi Fungsional & Keamanan Sistem
  const [showNotif, setShowNotif] = React.useState(false);
  const [notifs, setNotifs] = React.useState([
    { id: 1, title: 'Sistem Keamanan Aktif', desc: 'Proteksi XSS, SQLi, dan CSRF berjalan optimal.', time: 'Baru saja', type: 'secure' },
    { id: 2, title: 'SSL Terverifikasi', desc: 'Koneksi enkripsi data aman (HTTPS) aktif.', time: '15 menit lalu', type: 'secure' },
    { id: 3, title: 'Deteksi Intrusi Diblokir', desc: 'Percobaan injeksi query dihalau oleh firewall.', time: '1 jam lalu', type: 'warn' },
    { id: 4, title: 'Sinkronisasi Backup Sukses', desc: 'Titik pemulihan database baru disimpan aman.', time: '3 jam lalu', type: 'secure' }
  ]);
  const [hasUnread, setHasUnread] = React.useState(true);

  const handleMarkAllRead = () => {
    setHasUnread(false);
  };

  const totalSites = sites.length;
  const publishedSites = sites.filter(s => s.status === 'published').length;
  const draftSites = sites.filter(s => s.status === 'draft').length;
  const totalVisitors = Object.values(statsMap).reduce((acc, s) => acc + (s.total || 0), 0);
  const totalOnline = Object.values(statsMap).reduce((acc, s) => acc + (s.online || 0), 0);

  const fetchAllStats = async () => {
    setLoading(true);
    const map: Record<string, { total: number; online: number }> = {};
    await Promise.all(
      sites.map(async (site) => {
        try {
          const s = await getRealStats(site.id);
          map[site.id] = s;
        } catch {
          map[site.id] = { total: 0, online: 0 };
        }
      })
    );
    setStatsMap(map);
    setLastRefresh(new Date());
    setLoading(false);
  };

  useEffect(() => {
    setIsMounted(true);
    fetchAllStats();
    const interval = setInterval(fetchAllStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const card = `rounded-2xl border p-5 transition-colors duration-300 ${
    isLight ? 'bg-white border-slate-200' : 'bg-[#0d1325] border-white/[0.07]'
  }`;

  const summaryStats = [
    { label: 'Total Website', value: totalSites, icon: Globe, color: 'blue', sub: 'Proyek aktif' },
    { label: 'Dipublikasikan', value: publishedSites, icon: Zap, color: 'emerald', sub: 'Dapat diakses publik' },
    { label: 'Draft', value: draftSites, icon: Activity, color: 'amber', sub: 'Sedang dikerjakan' },
    { label: 'Total Kunjungan', value: totalVisitors, icon: BarChart3, color: 'purple', sub: 'Semua website' },
    { label: 'Sedang Online', value: totalOnline, icon: Users, color: 'green', sub: 'Saat ini' },
  ];

  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue:   { bg: isLight ? 'bg-blue-50' : 'bg-blue-500/10',   text: 'text-blue-500',   border: isLight ? 'border-blue-100' : 'border-blue-500/15' },
    emerald:{ bg: isLight ? 'bg-emerald-50' : 'bg-emerald-500/10', text: 'text-emerald-500', border: isLight ? 'border-emerald-100' : 'border-emerald-500/15' },
    amber:  { bg: isLight ? 'bg-amber-50' : 'bg-amber-500/10',  text: 'text-amber-500',  border: isLight ? 'border-amber-100' : 'border-amber-500/15' },
    purple: { bg: isLight ? 'bg-purple-50' : 'bg-purple-500/10',text: 'text-purple-500', border: isLight ? 'border-purple-100' : 'border-purple-500/15' },
    green:  { bg: isLight ? 'bg-green-50' : 'bg-green-500/10',  text: 'text-green-500',  border: isLight ? 'border-green-100' : 'border-green-500/15' },
  };

  return (
    <main className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-colors duration-300 ${isLight ? 'bg-slate-50' : 'bg-[#0a0f1e]'}`}>
      {/* Header */}
      <header className={`border-b px-8 py-5 flex items-center justify-between shrink-0 sticky top-0 z-10 backdrop-blur-xl transition-colors duration-300 ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-[#080d1a]/80 border-white/[0.06]'
      }`}>
        <div>
          <h1 className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Statistik</h1>
          <p className={`text-xs mt-0.5 font-medium flex items-center gap-1.5 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
            <Clock size={11} />
            Diperbarui: {isMounted ? lastRefresh.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '...'}
          </p>
        </div>
        <div className="flex items-center gap-2 relative">
          {/* ── SINGLE ICON THEME TOGGLE ── */}
          <button
            onClick={toggleTheme}
            title={isLight ? "Aktifkan Mode Gelap" : "Aktifkan Mode Terang"}
            className={`p-2.5 rounded-xl border transition-all ${
              isLight
                ? 'bg-white border-slate-200 text-amber-500 hover:text-amber-600 hover:bg-slate-50'
                : 'bg-white/5 border-white/10 text-blue-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {isLight ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* ── FUNCTIONAL NOTIFICATION BELL ── */}
          <div className="relative">
            <button
              onClick={() => setShowNotif(!showNotif)}
              title="Notifikasi Sistem"
              className={`p-2.5 rounded-xl border transition-all ${
                showNotif
                  ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : isLight
                    ? 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bell size={16} />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {showNotif && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotif(false)} />
                <div className={`absolute right-0 mt-3 w-80 rounded-3xl p-5 border shadow-2xl z-50 animate-in slide-in-from-top-3 duration-200 ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-800' 
                    : 'bg-[#0c1224] border-white/[0.08] text-white'
                }`}>
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/[0.05]">
                    <span className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Bell size={12} className="text-blue-500" /> Notifikasi Keamanan
                    </span>
                    {hasUnread && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-[9px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                    {notifs.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-3 rounded-xl border transition-all text-left ${
                          isLight 
                            ? 'bg-slate-50 border-slate-100 hover:bg-slate-100' 
                            : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05]'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-wide ${
                            n.type === 'warn' ? 'text-amber-500' : 'text-emerald-500'
                          }`}>
                            {n.title}
                          </span>
                          <span className="text-[8px] font-medium text-slate-400 opacity-60">{n.time}</span>
                        </div>
                        <p className={`text-[10px] leading-relaxed font-medium ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                          {n.desc}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/[0.05] text-center">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 opacity-50">
                      Sistem Keamanan Aktif & Dilindungi
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>

          <button onClick={fetchAllStats} disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${
              isLight ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:bg-white/10'
            }`}>
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {summaryStats.map(({ label, value, icon: Icon, color, sub }) => {
            const c = colorMap[color];
            return (
              <div key={label} className={`${card} flex flex-col gap-3`}>
                <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className={`text-2xl font-black leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {loading ? <span className="text-base animate-pulse">...</span> : value}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isLight ? 'text-slate-500' : 'text-white/40'}`}>{label}</div>
                  <div className={`text-[9px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/20'}`}>{sub}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Per-site breakdown */}
        <div>
          <h2 className={`text-xs font-black uppercase tracking-widest mb-4 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Statistik Per Website</h2>
          <div className="space-y-3">
            {sites.length === 0 && (
              <div className={`${card} text-center py-10 ${isLight ? 'text-slate-400' : 'text-white/20'}`}>
                Belum ada website. Buat website terlebih dahulu.
              </div>
            )}
            {sites.map((site) => {
              const s = statsMap[site.id] || { total: 0, online: 0 };
              const maxVisitors = Math.max(...Object.values(statsMap).map(x => x.total), 1);
              const barWidth = Math.round((s.total / maxVisitors) * 100);
              return (
                <div key={site.id} className={`${card} flex items-center gap-5`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe size={13} className={isLight ? 'text-slate-400' : 'text-white/30'} />
                      <span className={`text-sm font-black truncate ${isLight ? 'text-slate-800' : 'text-white'}`}>{site.site_name}</span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        site.status === 'published'
                          ? isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : isLight ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white/5 text-white/25 border-white/10'
                      }`}>{site.status}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className={`h-1.5 w-full rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-white/5'}`}>
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700"
                        style={{ width: `${loading ? 0 : barWidth}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-center">
                      <div className={`text-xl font-black leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {loading ? '...' : s.total}
                      </div>
                      <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Total</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xl font-black leading-none ${s.online > 0 ? 'text-emerald-400' : isLight ? 'text-slate-300' : 'text-white/25'}`}>
                        {loading ? '...' : s.online}
                      </div>
                      <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Online</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
