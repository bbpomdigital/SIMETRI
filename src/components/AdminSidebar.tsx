'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, LayoutDashboard, Settings, LogOut, Shield, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { logoutAction } from '@/actions/auth';
import NanoBananaIcon from '@/components/NanoBananaIcon';

interface AdminSidebarProps {
  sitesCount: number;
  publishedCount: number;
  draftCount: number;
}

export default function AdminSidebar({ sitesCount }: AdminSidebarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === 'light';

  const nav = [
    { href: '/admin', label: 'Website Saya', icon: Globe, count: sitesCount },
    { href: '/admin/statistik', label: 'Statistik', icon: LayoutDashboard, count: null },
    { href: '/admin/pengaturan', label: 'Pengaturan', icon: Settings, count: null },
  ];

  return (
    <aside className={`w-64 shrink-0 hidden md:flex flex-col border-r transition-colors duration-300 ${
      isLight ? 'bg-white border-slate-200' : 'bg-[#080d1a] border-white/[0.06]'
    }`}>
      {/* Logo */}
      <div className={`p-6 flex items-center gap-3 border-b transition-colors duration-300 ${isLight ? 'border-slate-100' : 'border-white/[0.06]'}`}>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
          <Shield size={18} strokeWidth={2.5} className="text-white" />
        </div>
        <div>
          <div className={`text-sm font-black tracking-tight leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
            SIMETRI<span className="text-blue-500">PRO</span>
          </div>
          <div className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <div className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 mb-3 mt-2 ${isLight ? 'text-slate-400' : 'text-white/20'}`}>Menu Utama</div>
        {nav.map(({ href, label, icon: Icon, count }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                isActive
                  ? isLight
                    ? 'bg-blue-50 border border-blue-200 text-blue-700'
                    : 'bg-blue-600/20 border border-blue-500/30 text-blue-300'
                  : isLight
                    ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent'
                    : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={16} />
              {label}
              {count !== null && (
                <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full ${
                  isActive
                    ? isLight ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/30 text-blue-300'
                    : isLight ? 'bg-slate-100 text-slate-500' : 'bg-white/10 text-white/30'
                }`}>{count}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={`p-4 border-t space-y-2 transition-colors duration-300 ${isLight ? 'border-slate-100' : 'border-white/[0.06]'}`}>
        {/* Status indicator */}
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
          isLight ? 'bg-emerald-50 border border-emerald-200' : 'bg-emerald-500/10 border border-emerald-500/20'
        }`}>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>Sistem Aktif</span>
        </div>

        <form action={logoutAction}>
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
            isLight
              ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
              : 'text-white/30 hover:text-red-400 hover:bg-red-500/10'
          }`}>
            <LogOut size={16} />
            Keluar
          </button>
        </form>
      </div>
    </aside>
  );
}
