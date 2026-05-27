'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, Shield, Globe, Smartphone, Zap, BarChart3,
  FileCheck, Users, Lock, ChevronRight, Star, CheckCircle2,
  Building2, Award, ClipboardList, Search, Sun, Moon
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  return (
    <main className={`min-h-screen selection:bg-blue-500/30 overflow-x-hidden font-sans transition-colors duration-500 ${
      isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#020817] text-white'
    }`}>

      {/* ── BACKGROUND MESH ── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {isLight ? (
          <>
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-blue-500/5 rounded-full blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-blue-700/15 rounded-full blur-[120px]" />
            <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-indigo-700/15 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-700/8 rounded-full blur-[100px]" />
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
          </>
        )}
      </div>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
        <div className={`max-w-7xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl shadow-2xl border transition-all duration-300 ${
          isLight 
            ? 'bg-white/95 border-slate-200/80 backdrop-blur-2xl shadow-slate-200/50' 
            : 'bg-[#020817]/60 backdrop-blur-2xl border-white/[0.08]'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Shield size={18} strokeWidth={2.5} className="text-white" />
            </div>
            <div>
              <div className={`text-sm font-black tracking-tight leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                SIMETRI<span className="text-blue-500">BBPOM</span>
              </div>
              <div className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                Portal Digital Terintegrasi
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {['Fitur', 'Layanan', 'Tentang'].map(m => (
              <a 
                key={m} 
                href={`#${m.toLowerCase()}`} 
                className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
                  isLight ? 'text-slate-500 hover:text-slate-900' : 'text-white/40 hover:text-white'
                }`}
              >
                {m}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {/* ── THEME TOGGLE ── */}
            <button
              onClick={toggleTheme}
              title={isLight ? 'Ganti ke Mode Gelap' : 'Ganti ke Mode Terang'}
              className={`p-2.5 rounded-xl border transition-all duration-300 ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-amber-500 hover:bg-slate-100'
                  : 'bg-white/5 border-white/10 text-blue-400 hover:bg-white/10 hover:text-blue-300'
              }`}
            >
              {isLight ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <Link href="/login" className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25 active:scale-95 text-white">
              Portal Admin <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT TEXT */}
            <div className="space-y-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
                isLight ? 'bg-blue-50 border-blue-200/60' : 'bg-blue-500/10 border-blue-500/20'
              }`}>
                <Star size={12} className="text-blue-500 fill-blue-500" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Portal Resmi BBPOM di Samarinda</span>
              </div>

              <h1 className={`text-5xl lg:text-7xl font-black tracking-tight leading-[0.92] ${isLight ? 'text-slate-950' : 'text-white'}`}>
                Platform Digital<br />
                <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
                  Pengawasan
                </span><br />
                Obat & Makanan
              </h1>

              <p className={`text-base leading-relaxed max-w-lg font-medium ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                Hub pusat layanan digital <span className={isLight ? 'text-slate-800 font-bold' : 'text-white font-semibold'}>Balai Besar POM di Samarinda</span> — 
                akses cepat ke Sertilink, Sijebol, dan seluruh aplikasi pengawasan publik dalam satu pintu terintegrasi.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/login" className={`group flex items-center gap-3 px-8 py-4 font-black rounded-2xl transition-all active:scale-95 ${
                  isLight 
                    ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-[0_16px_40px_rgba(15,23,42,0.15)]' 
                    : 'bg-white text-[#020817] hover:bg-blue-50 shadow-[0_16px_40px_rgba(255,255,255,0.05)]'
                }`}>
                  Akses Dashboard
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a href="#layanan" className={`flex items-center gap-3 px-8 py-4 border rounded-2xl font-bold transition-all backdrop-blur-sm ${
                  isLight 
                    ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}>
                  Lihat Layanan
                </a>
              </div>

              {/* MINI STATS */}
              <div className={`flex gap-8 pt-4 border-t ${isLight ? 'border-slate-200' : 'border-white/5'}`}>
                {[
                  { val: '99.9%', label: 'Uptime Server' },
                  { val: '6+', label: 'Portal Terintegrasi' },
                  { val: '24/7', label: 'Layanan Aktif' },
                ].map(s => (
                  <div key={s.label}>
                    <div className={`text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{s.val}</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT VISUAL CARD */}
            <div className="relative hidden lg:block animate-in fade-in-50 slide-in-from-right-10 duration-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[40px] blur-2xl scale-95" />
              <div className={`relative border rounded-[40px] p-8 backdrop-blur-sm overflow-hidden transition-colors duration-300 ${
                isLight ? 'bg-white border-slate-200/80 shadow-2xl' : 'bg-white/[0.03] border-white/10'
              }`}>

                {/* Header card */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/40 text-white">
                    <Shield size={24} />
                  </div>
                  <div>
                    <div className={`font-black text-sm ${isLight ? 'text-slate-900' : 'text-white'}`}>BBPOM Samarinda</div>
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Dashboard Statistik</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
                  </div>
                </div>

                {/* Chart bars */}
                <div className="mb-8">
                  <div className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Aktivitas Pengawasan (Minggu Ini)</div>
                  <div className="flex items-end gap-2 h-24">
                    {[60, 85, 45, 90, 70, 95, 80].map((h, i) => (
                      <div key={i} className="flex-1 rounded-lg overflow-hidden" style={{ height: `${h}%` }}>
                        <div
                          className="w-full h-full rounded-lg transition-all duration-700"
                          style={{ background: i === 5 ? 'linear-gradient(to top, #2563eb, #60a5fa)' : isLight ? '#f1f5f9' : 'rgba(255,255,255,0.06)' }}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map(d => (
                      <div key={d} className={`text-[9px] font-bold flex-1 text-center ${isLight ? 'text-slate-300' : 'text-white/20'}`}>{d}</div>
                    ))}
                  </div>
                </div>

                {/* Metric cards */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: FileCheck, label: 'Sertifikat Aktif', val: '1.248', color: 'text-blue-500' },
                    { icon: Users, label: 'Pengguna Terdaftar', val: '892', color: 'text-indigo-500' },
                    { icon: Search, label: 'Pengawasan Bulan Ini', val: '346', color: 'text-emerald-500' },
                    { icon: Award, label: 'Zona Integritas', val: 'WBK', color: 'text-amber-500' },
                  ].map(({ icon: Icon, label, val, color }) => (
                    <div key={label} className={`p-4 rounded-2xl border transition-colors duration-300 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.04] border-white/[0.06]'
                    }`}>
                      <Icon size={16} className={`${color} mb-2`} />
                      <div className={`text-lg font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>{val}</div>
                      <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LAYANAN PUBLIK ── */}
      <section id="layanan" className={`px-4 py-24 transition-colors duration-300 ${isLight ? 'bg-slate-100/50' : ''}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Ekosistem Digital</div>
            <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Portal Layanan Publik</h2>
            <p className={`max-w-lg mx-auto font-medium ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Seluruh layanan BBPOM Samarinda kini hadir dalam satu ekosistem digital yang terintegrasi dan mudah diakses.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: FileCheck, title: 'Sertilink', desc: 'Sistem sertifikasi dan penerbitan surat keterangan secara elektronik, cepat, dan terverifikasi.', color: 'from-blue-500/10 to-transparent', badge: 'Aktif', badgeColor: 'emerald' },
              { icon: ClipboardList, title: 'Sijebol', desc: 'Platform pelaporan dan pengawasan data distribusi pangan dan obat-obatan di wilayah Kaltim.', color: 'from-indigo-500/10 to-transparent', badge: 'Aktif', badgeColor: 'emerald' },
              { icon: Search, title: 'Cek Produk', desc: 'Alat bantu cek registrasi resmi produk obat dan makanan secara real-time langsung dari database BPOM.', color: 'from-violet-500/10 to-transparent', badge: 'Beta', badgeColor: 'amber' },
              { icon: Building2, title: 'PPID Online', desc: 'Layanan Pejabat Pengelola Informasi dan Dokumentasi untuk keterbukaan informasi publik.', color: 'from-cyan-500/10 to-transparent', badge: 'Aktif', badgeColor: 'emerald' },
              { icon: Users, title: 'Pengaduan Konsumen', desc: 'Kanal resmi pengaduan masyarakat terkait temuan produk bermasalah di Kalimantan Timur.', color: 'from-rose-500/10 to-transparent', badge: 'Aktif', badgeColor: 'emerald' },
              { icon: BarChart3, title: 'Analitik & Laporan', desc: 'Dashboard statistik dan monitoring kinerja pengawasan secara komprehensif untuk internal BBPOM.', color: 'from-emerald-500/10 to-transparent', badge: 'Internal', badgeColor: 'slate' },
            ].map(({ icon: Icon, title, desc, color, badge, badgeColor }) => {
              const bgBadge = {
                emerald: isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
                amber: isLight ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-amber-500/15 text-amber-400 border-amber-500/20',
                slate: isLight ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-white/5 text-white/40 border-white/10',
              }[badgeColor];

              return (
                <div key={title} className={`group relative p-7 rounded-3xl bg-gradient-to-br border transition-all duration-300 cursor-pointer ${color} ${
                  isLight 
                    ? 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/40' 
                    : 'border-white/[0.07] hover:border-white/20'
                }`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center group-hover:scale-110 transition-transform ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-white/10 border-white/10 text-white/80'
                    }`}>
                      <Icon size={22} />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${bgBadge}`}>
                      {badge}
                    </span>
                  </div>
                  <h3 className={`text-lg font-black mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>{title}</h3>
                  <p className={`text-sm leading-relaxed font-medium ${isLight ? 'text-slate-400' : 'text-white/40'}`}>{desc}</p>
                  <div className={`mt-5 flex items-center gap-1 text-[10px] font-black uppercase tracking-widest group-hover:text-blue-500 transition-colors ${
                    isLight ? 'text-slate-300' : 'text-white/30'
                  }`}>
                    Selengkapnya <ChevronRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FITUR BENTO ── */}
      <section id="fitur" className="px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Kenapa SIMETRI?</div>
            <h2 className={`text-4xl md:text-5xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Teknologi Kelas Enterprise</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className={`md:col-span-2 p-10 rounded-[32px] bg-gradient-to-br from-blue-500/10 to-transparent border relative overflow-hidden group transition-colors duration-300 ${
              isLight ? 'bg-white border-slate-200/80' : 'border-white/[0.07]'
            }`}>
              <Globe className="absolute -right-8 -bottom-8 w-48 h-48 text-blue-500/5 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/30 text-white"><Globe size={24} /></div>
                <h3 className={`text-2xl font-black mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Data Real-Time Terpusat</h3>
                <p className={`leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/50'}`}>Integrasi langsung ke seluruh sistem database BBPOM Samarinda — data selalu mutakhir, valid, dan dapat diaudit kapan saja.</p>
                <div className="mt-6 flex gap-2">
                  {['Supabase', 'MySQL', 'REST API'].map(t => (
                    <span key={t} className={`px-3 py-1 border rounded-full text-[10px] font-bold ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-white/50'
                    }`}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-[32px] bg-gradient-to-br from-indigo-500/10 to-transparent border group transition-colors duration-300 ${
              isLight ? 'bg-white border-slate-200/80' : 'border-white/[0.07]'
            }`}>
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-600/30 text-white"><Lock size={24} /></div>
              <h3 className={`text-2xl font-black mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Keamanan Berlapis</h3>
              <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-500' : 'text-white/50'}`}>Autentikasi sesi, enkripsi end-to-end, dan middleware proteksi rute untuk menjaga integritas data.</p>
              <div className="mt-6 space-y-2">
                {['Enkripsi Sesi', 'RLS Database', 'Middleware Auth'].map(f => (
                  <div key={f} className={`flex items-center gap-2 text-xs font-bold ${isLight ? 'text-slate-500' : 'text-white/40'}`}>
                    <CheckCircle2 size={12} className="text-indigo-500 animate-pulse" /> {f}
                  </div>
                ))}
              </div>
            </div>

            <div className={`p-8 rounded-[32px] border flex flex-col items-center text-center group transition-all duration-300 ${
              isLight ? 'bg-white border-slate-200/80 shadow-lg shadow-slate-100' : 'bg-white/[0.03] border-white/[0.07]'
            }`}>
              <div className="w-14 h-14 bg-emerald-500/15 rounded-full flex items-center justify-center text-emerald-500 mb-5 group-hover:scale-110 transition-transform">
                <Smartphone size={28} />
              </div>
              <h3 className={`text-xl font-black mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Mobile Responsive</h3>
              <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Tampilan otomatis menyesuaikan di semua perangkat — smartphone, tablet, hingga desktop.</p>
            </div>

            <div className={`md:col-span-2 p-10 rounded-[32px] bg-gradient-to-br from-white/[0.04] to-transparent border flex items-center justify-between group transition-all duration-300 ${
              isLight ? 'bg-white border-slate-200/80' : 'border-white/[0.07]'
            }`}>
              <div>
                <h3 className={`text-2xl font-black mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Visual Builder Premium</h3>
                <p className={`text-sm leading-relaxed max-w-sm ${isLight ? 'text-slate-500' : 'text-white/50'}`}>Buat dan kelola halaman web tanpa coding — drag & drop komponen, edit langsung, dan publish instan.</p>
                <div className="mt-6 flex gap-3">
                  <span className="px-4 py-2 bg-blue-600 rounded-xl text-xs font-black text-white">Next.js 16</span>
                  <span className={`px-4 py-2 border rounded-xl text-xs font-bold ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white/5 border-white/10 text-white/50'
                  }`}>React 19</span>
                </div>
              </div>
              <div className="hidden sm:flex flex-col gap-2 shrink-0">
                {[Zap, Globe, Shield].map((Icon, i) => (
                  <div key={i} className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-300' : 'bg-white/5 border-white/10 text-white/20'
                  }`}>
                    <Icon size={20} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-24">
        <div className="max-w-5xl mx-auto relative shadow-2xl rounded-[48px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 opacity-95" />
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          </div>
          <div className="relative z-10 text-center py-20 px-8 space-y-8 text-white">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/20 text-[10px] font-black uppercase tracking-widest">
              <Shield size={12} /> Akses Terbatas
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
              Siap Bergabung di<br />Era Digital BBPOM?
            </h2>
            <p className="text-blue-100/80 text-lg font-medium max-w-xl mx-auto">
              Kelola seluruh aplikasi, pengawasan, dan portal layanan publik BBPOM Samarinda dari satu dashboard yang powerful.
            </p>
            <Link href="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-700 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl text-sm">
              Masuk ke Portal Admin
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={`px-4 py-16 border-t transition-colors duration-300 ${isLight ? 'bg-slate-100 border-slate-200' : 'border-white/[0.05]'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 text-white">
                  <Shield size={18} />
                </div>
                <span className={`font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>SIMETRI<span className="text-blue-500">BBPOM</span></span>
              </div>
              <p className={`text-sm leading-relaxed max-w-xs font-medium ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                Sistem Manajemen Template Website Terintegrasi — Platform resmi digitalisasi BBPOM di Samarinda, Kalimantan Timur.
              </p>
            </div>
            <div>
              <div className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Navigasi</div>
              {['Fitur', 'Layanan Publik', 'Portal Admin', 'Kontak'].map(l => (
                <a key={l} href="#" className={`block text-sm font-bold mb-2 transition-colors ${
                  isLight ? 'text-slate-500 hover:text-slate-900' : 'text-white/30 hover:text-white'
                }`}>{l}</a>
              ))}
            </div>
            <div>
              <div className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Legal</div>
              {['Kebijakan Privasi', 'Syarat & Ketentuan', 'Aksesibilitas'].map(l => (
                <a key={l} href="#" className={`block text-sm font-bold mb-2 transition-colors ${
                  isLight ? 'text-slate-500 hover:text-slate-900' : 'text-white/30 hover:text-white'
                }`}>{l}</a>
              ))}
            </div>
          </div>
          <div className={`pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 ${
            isLight ? 'border-slate-200' : 'border-white/[0.05]'
          }`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/20'}`}>© 2026 BBPOM di Samarinda. Hak Cipta Dilindungi.</p>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-slate-400' : 'text-white/15'}`}>Dibangun dengan ❤️ untuk Pelayanan Publik</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
