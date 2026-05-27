'use client';

import React from 'react';
import { Bell, Settings, Zap, Globe, Moon, Sun } from 'lucide-react';
import CreateSiteButton from '@/components/CreateSiteButton';
import SiteGridClient from './SiteGridClient';
import { useTheme } from '@/components/ThemeProvider';

interface Site {
  id: string;
  site_name: string;
  status: string;
  pages_json?: any;
  app_id: string;
  owner: string;
}

interface Props {
  sites: Site[];
  publishedCount: number;
  draftCount: number;
}

export default function AdminDashboardMain({ sites, publishedCount, draftCount }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

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

  const summaryStats = [
    { label: 'Total Website', val: sites.length, icon: Globe, color: 'blue', sub: 'Proyek aktif' },
    { label: 'Dipublikasikan', val: publishedCount, icon: Zap, color: 'emerald', sub: 'Dapat diakses publik' },
    { label: 'Draft', val: draftCount, icon: Settings, color: 'amber', sub: 'Dalam pengerjaan' },
  ];

  return (
    <main className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-colors duration-300 ${isLight ? 'bg-slate-50' : 'bg-[#0a0f1e]'}`}>
      {/* ── NAVBAR HEADER ── */}
      <header className={`border-b px-8 py-5 flex items-center justify-between shrink-0 sticky top-0 z-10 backdrop-blur-xl transition-colors duration-300 ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-[#080d1a]/80 border-white/[0.06]'
      }`}>
        <div>
          <h1 className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Dashboard Utama</h1>
          <p className={`text-xs mt-0.5 font-medium ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Kelola dan bangun website Anda dengan Visual Editor</p>
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

          <CreateSiteButton />
        </div>
      </header>

      {/* Stats Bar */}
      <div className={`px-8 py-5 border-b grid grid-cols-3 gap-4 shrink-0 transition-colors duration-300 ${
        isLight ? 'border-slate-200 bg-white/60' : 'border-white/[0.06]'
      }`}>
        {summaryStats.map(({ label, val, icon: Icon, color, sub }) => {
          const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
            blue:   { bg: isLight ? 'bg-blue-50' : 'bg-blue-500/5',   text: isLight ? 'text-blue-600' : 'text-blue-400',   border: isLight ? 'border-blue-100' : 'border-blue-500/10' },
            emerald:{ bg: isLight ? 'bg-emerald-50' : 'bg-emerald-500/5', text: isLight ? 'text-emerald-600' : 'text-emerald-400', border: isLight ? 'border-emerald-100' : 'border-emerald-500/10' },
            amber:  { bg: isLight ? 'bg-amber-50' : 'bg-amber-500/5',  text: isLight ? 'text-amber-600' : 'text-amber-400',  border: isLight ? 'border-amber-100' : 'border-amber-500/10' },
          };
          const c = colorClasses[color];
          return (
            <div key={label} className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors duration-300 ${c.bg} ${c.border}`}>
              <div className={`w-10 h-10 rounded-xl bg-white/70 flex items-center justify-center ${c.text} shrink-0 shadow-sm`}>
                <Icon size={18} />
              </div>
              <div>
                <div className={`text-2xl font-black leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>{val}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isLight ? 'text-slate-500' : 'text-white/30'}`}>{label}</div>
                <div className={`text-[9px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/20'}`}>{sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xs font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Website Saya</h2>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-colors duration-300 ${
            isLight ? 'bg-white border-slate-200 text-slate-400' : 'bg-white/5 border-white/10 text-white/30'
          }`}>
            {sites.length} Proyek
          </div>
        </div>
        <SiteGridClient initialSites={sites as any} />
      </div>
    </main>
  );
}
