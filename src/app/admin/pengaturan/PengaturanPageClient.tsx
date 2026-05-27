'use client';

import React, { useState } from 'react';
import { Moon, Sun, Globe, Bell, Shield, User, Palette, ChevronRight, Check, Monitor } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function PengaturanPageClient() {
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

  const [notifEnabled, setNotifEnabled] = useState(true);
  const [autoPublish, setAutoPublish] = useState(false);

  const handleMarkAllRead = () => {
    setHasUnread(false);
  };

  const card = `rounded-2xl border transition-colors duration-300 ${
    isLight ? 'bg-white border-slate-200' : 'bg-[#0d1325] border-white/[0.07]'
  }`;

  const label = `text-xs font-black uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/30'}`;
  const title = `text-sm font-bold ${isLight ? 'text-slate-800' : 'text-white'}`;
  const subtitle = `text-[11px] ${isLight ? 'text-slate-400' : 'text-white/25'}`;
  const divider = `border-t ${isLight ? 'border-slate-100' : 'border-white/[0.06]'}`;

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? 'bg-blue-600' : isLight ? 'bg-slate-200' : 'bg-white/10'}`}
    >
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${value ? 'left-6' : 'left-1'}`} />
    </button>
  );

  return (
    <main className={`flex-1 flex flex-col min-h-screen overflow-hidden transition-colors duration-300 ${isLight ? 'bg-slate-50' : 'bg-[#0a0f1e]'}`}>
      {/* Header */}
      <header className={`border-b px-8 py-5 flex items-center justify-between shrink-0 sticky top-0 z-10 backdrop-blur-xl transition-colors duration-300 ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-[#080d1a]/80 border-white/[0.06]'
      }`}>
        <div>
          <h1 className={`text-xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Pengaturan</h1>
          <p className={`text-xs mt-0.5 font-medium ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Kelola preferensi dan konfigurasi akun Anda</p>
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
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 max-w-2xl">

        {/* ── TAMPILAN ── */}
        <div>
          <div className={`${label} mb-3 flex items-center gap-2`}><Palette size={11} /> Tampilan</div>
          <div className={card}>
            {/* Tema */}
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isLight ? 'bg-amber-50 text-amber-500' : 'bg-blue-500/10 text-blue-400'}`}>
                  {isLight ? <Sun size={16} /> : <Moon size={16} />}
                </div>
                <div>
                  <div className={title}>Tema Tampilan</div>
                  <div className={subtitle}>Aktif: {isLight ? 'Mode Terang (Light)' : 'Mode Gelap (Dark)'}</div>
                </div>
              </div>
              {/* Theme Switcher */}
              <div className={`flex items-center p-1 rounded-xl gap-1 ${isLight ? 'bg-slate-100' : 'bg-white/5'}`}>
                <button
                  onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                    theme === 'dark'
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : isLight ? 'text-slate-400 hover:text-slate-600' : 'text-white/30 hover:text-white'
                  }`}
                >
                  <Moon size={12} /> Dark
                </button>
                <button
                  onClick={() => { if (theme !== 'light') toggleTheme(); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                    theme === 'light'
                      ? 'bg-amber-400 text-white shadow-lg shadow-amber-400/30'
                      : isLight ? 'text-slate-400 hover:text-slate-600' : 'text-white/30 hover:text-white'
                  }`}
                >
                  <Sun size={12} /> Light
                </button>
              </div>
            </div>

            {/* Preview card */}
            <div className={`mx-5 mb-5 rounded-xl p-4 flex items-center gap-3 border ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.03] border-white/[0.07]'
            }`}>
              <Monitor size={20} className={isLight ? 'text-slate-400' : 'text-white/30'} />
              <div>
                <div className={`text-xs font-bold ${isLight ? 'text-slate-700' : 'text-white/60'}`}>Preview Aktif</div>
                <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-white/25'}`}>
                  {isLight ? '☀️ Tampilan terang diterapkan ke seluruh dashboard' : '🌙 Tampilan gelap diterapkan ke seluruh dashboard'}
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-amber-400' : 'bg-blue-400'} animate-pulse`} />
                <span className={`text-[9px] font-black uppercase tracking-wider ${isLight ? 'text-amber-500' : 'text-blue-400'}`}>Aktif</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── NOTIFIKASI ── */}
        <div>
          <div className={`${label} mb-3 flex items-center gap-2`}><Bell size={11} /> Notifikasi</div>
          <div className={card}>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isLight ? 'bg-blue-50 text-blue-500' : 'bg-blue-500/10 text-blue-400'}`}>
                  <Bell size={16} />
                </div>
                <div>
                  <div className={title}>Notifikasi Sistem</div>
                  <div className={subtitle}>Aktifkan pemberitahuan event penting</div>
                </div>
              </div>
              <Toggle value={notifEnabled} onChange={() => setNotifEnabled(v => !v)} />
            </div>
            <div className={divider} />
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isLight ? 'bg-emerald-50 text-emerald-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <Globe size={16} />
                </div>
                <div>
                  <div className={title}>Auto Publikasi</div>
                  <div className={subtitle}>Otomatis publikasi website saat dibuat</div>
                </div>
              </div>
              <Toggle value={autoPublish} onChange={() => setAutoPublish(v => !v)} />
            </div>
          </div>
        </div>

        {/* ── KEAMANAN ── */}
        <div>
          <div className={`${label} mb-3 flex items-center gap-2`}><Shield size={11} /> Keamanan</div>
          <div className={card}>
            <div className={`p-5 flex items-center justify-between hover:${isLight ? 'bg-slate-50' : 'bg-white/[0.02]'} rounded-t-2xl cursor-pointer transition-colors`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-white/40'}`}>
                  <User size={16} />
                </div>
                <div>
                  <div className={title}>Ganti Password</div>
                  <div className={subtitle}>Perbarui kata sandi akun Anda</div>
                </div>
              </div>
              <ChevronRight size={16} className={isLight ? 'text-slate-300' : 'text-white/20'} />
            </div>
            <div className={divider} />
            <div className={`p-5 flex items-center justify-between hover:${isLight ? 'bg-slate-50' : 'bg-white/[0.02]'} rounded-b-2xl cursor-pointer transition-colors`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/5 text-white/40'}`}>
                  <Shield size={16} />
                </div>
                <div>
                  <div className={title}>Sesi Login Aktif</div>
                  <div className={subtitle}>Kelola perangkat yang terhubung</div>
                </div>
              </div>
              <ChevronRight size={16} className={isLight ? 'text-slate-300' : 'text-white/20'} />
            </div>
          </div>
        </div>

        {/* ── VERSI ── */}
        <div className={`text-center text-[10px] font-bold ${isLight ? 'text-slate-300' : 'text-white/15'} pb-4`}>
          SIMETRI PRO · v2.0.0 · Semua hak dilindungi
        </div>
      </div>
    </main>
  );
}
