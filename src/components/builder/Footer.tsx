"use client";
import React, { useState, useEffect } from 'react';
import SmartIcon from '@/components/builder/SmartIcon';
import { 
  Users, BarChart, Globe, MessageCircle, Share2, Phone, Mail, MapPin, Clock,
  Video, Camera, Send, Link as LinkIcon 
} from 'lucide-react';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Globe,
  MessageCircle,
  Video,
  Camera,
  Send,
  Users,
  Share2,
  Link: LinkIcon
};

export const Footer = ({ data, isEditor, onEditField, siteId, onAddSocial, onRemoveSocial }: { 
  data: any, 
  isEditor?: boolean, 
  onEditField?: (field: string, value: string, label: string, idx?: number) => void,
  siteId?: string,
  onAddSocial?: () => void,
  onRemoveSocial?: (idx: number) => void
}) => {
  const editableClass = isEditor ? "cursor-pointer hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5 rounded-lg transition-all px-2 -mx-2" : "";
  
  // Real-time Database Stats
  const [online, setOnline] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!siteId) return;

    // 1. Generate atau ambil Visitor ID secara aman
    let visitorId: string;
    try {
      visitorId = localStorage.getItem('visitor_id') || '';
      if (!visitorId) {
        visitorId = 'v_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitor_id', visitorId);
      }
    } catch {
      try {
        visitorId = sessionStorage.getItem('visitor_id') || '';
        if (!visitorId) {
          visitorId = 'v_' + Math.random().toString(36).substr(2, 9);
          sessionStorage.setItem('visitor_id', visitorId);
        }
      } catch {
        visitorId = 'v_temp_' + Math.random().toString(36).substr(2, 9);
      }
    }

    // 2. Rekam kunjungan via API route (bukan Server Action)
    fetch('/api/stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ siteId, visitorId }),
    })
      .then(() => fetchStats())
      .catch(console.error);

    // 3. Ambil statistik terkini
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/stats?siteId=${encodeURIComponent(siteId)}`);
        if (res.ok) {
          const stats = await res.json();
          setOnline(stats.online ?? 0);
          setTotal(stats.total ?? 0);
        }
      } catch (e) {
        console.error('Stats fetch error:', e);
      }
    };

    fetchStats();

    // 4. Polling setiap 30 detik
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [siteId]);


  const formatNumber = (num: number) => {
    // Combine base value from editor with real tracked count
    const baseTotal = parseInt((data.totalVisits || '0').replace(/\D/g, '')) || 0;
    const baseOnline = parseInt((data.online || '0').replace(/\D/g, '')) || 0;
    
    const finalVal = num + (num === online ? baseOnline : baseTotal);
    return finalVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-10 px-6 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Kolom 1: Statistik */}
        <div className="space-y-6">
          <h4 className="text-sm font-black uppercase tracking-[2px]">Statistik Pengunjung</h4>
          <div className="space-y-4">
            <div 
              onClick={() => isEditor && onEditField?.('online', data.online || '12', 'Total Online (Nilai Dasar)')}
              className={`flex items-center gap-4 group ${editableClass}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <Users size={18} />
              </div>
              <div>
                <div className="text-xl font-black">{formatNumber(online)}</div>
                <div className="text-[10px] font-bold text-white/40 uppercase">Online</div>
              </div>
            </div>
            <div 
              onClick={() => isEditor && onEditField?.('totalVisits', data.totalVisits || '1502103', 'Total Kunjungan (Nilai Dasar)')}
              className={`flex items-center gap-4 group ${editableClass}`}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all">
                <BarChart size={18} />
              </div>
              <div>
                <div className="text-xl font-black">{formatNumber(total)}</div>
                <div className="text-[10px] font-bold text-white/40 uppercase">Total Kunjungan</div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom 2: Tentang */}
        <div className="space-y-6">
          <h4 
            onClick={() => isEditor && onEditField?.('aboutTitle', data.aboutTitle || 'SERTILINK', 'Judul Tentang Kami')}
            className={`text-sm font-black uppercase tracking-[2px] ${editableClass}`}
          >
            {data.aboutTitle || 'SERTILINK'}
          </h4>
          <p 
            onClick={() => isEditor && onEditField?.('aboutText', data.aboutText || 'Unit Pelaksana Teknis Badan POM...', 'Deskripsi Tentang Kami')}
            className={`text-xs leading-relaxed text-white/50 font-medium ${editableClass} mt-2`}
          >
            {data.aboutText || 'Unit Pelaksana Teknis Badan POM di Samarinda hadir untuk melindungi masyarakat dari obat dan makanan yang berisiko terhadap kesehatan.'}
          </p>
          <div className="flex items-center gap-4 flex-wrap mt-3">
            {(data.socialLinks || [
              { icon: 'Globe', url: data.websiteUrl || '#', label: 'Website' },
              { icon: 'MessageCircle', url: data.waUrl || '#', label: 'WhatsApp' }
            ]).map((item: any, idx: number) => {
              return (
                <div key={idx} className="relative group/social flex flex-col items-center">
                  {isEditor && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemoveSocial?.(idx); }}
                      className="absolute -top-3 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover/social:opacity-100 transition-opacity shadow-lg z-[20]"
                    >
                      ×
                    </button>
                  )}
                  
                  {!isEditor ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                      <SmartIcon name={item.icon} size={18} className="text-white/40 hover:text-white cursor-pointer transition-colors" fallback={Globe} />
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1 hover:bg-white/10 transition-all select-none">
                      <div
                        onClick={() => onEditField?.(`socialLinks.${idx}.icon`, item.icon, `Ikon Sosial (Contoh: Globe, MessageCircle, material:public, material:chat, atau URL Gambar)`, idx)}
                        className="cursor-pointer text-white/50 hover:text-white flex items-center w-4 h-4 justify-center overflow-hidden"
                        title="Klik untuk ganti Ikon"
                      >
                        <SmartIcon name={item.icon} size={14} className="text-white/50 hover:text-white" fallback={Globe} />
                      </div>
                      <div className="w-px h-3 bg-white/10"></div>
                      <span 
                        onClick={() => onEditField?.(`socialLinks.${idx}.url`, item.url, `Tautan / URL`, idx)}
                        className="text-[9px] font-bold text-white/40 cursor-pointer hover:text-white truncate max-w-[65px] uppercase tracking-wider"
                        title="Klik untuk ubah Link"
                      >
                        {item.url === '#' ? 'Link' : (item.url.startsWith('http') ? 'Eksternal' : 'Link')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {isEditor && (
              <button 
                onClick={onAddSocial}
                className="w-7 h-7 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 hover:text-white transition-all border border-dashed border-white/20"
                title="Tambah Media Sosial / Tautan Baru"
              >
                <span className="text-sm font-bold leading-none">+</span>
              </button>
            )}
          </div>
        </div>

        {/* Kolom 3: Jam Layanan */}
        <div className="space-y-6">
          <h4 className="text-sm font-black uppercase tracking-[2px]">Jam Layanan</h4>
          <div className="space-y-4">
            {(data.schedule || [
              { days: 'Senin - Kamis', time: '08.00 - 16.30 WITA' },
              { days: 'Jumat', time: '08.00 - 16.00 WITA' }
            ]).map((item: any, idx: number) => (
              <div 
                key={idx} 
                onClick={() => isEditor && onEditField?.(`schedule.${idx}.time`, item.time, `Jam Kerja (${item.days})`)}
                className={`flex gap-3 ${editableClass}`}
              >
                <Clock size={16} className="text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-black text-white/40 uppercase text-[9px]">{item.days}</div>
                  <div className="font-bold">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 4: Kontak */}
        <div className="space-y-6">
          <h4 className="text-sm font-black uppercase tracking-[2px]">Kontak Kami</h4>
          <div className="space-y-4">
            <div 
              onClick={() => isEditor && onEditField?.('phone', data.phone || '(0541) 741492', 'Nomor Telepon')}
              className={`flex gap-3 ${editableClass}`}
            >
              <Phone size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs font-bold">{data.phone || '(0541) 741492 / 741517'}</div>
            </div>
            <div 
              onClick={() => isEditor && onEditField?.('email', data.email || 'samarinda@pom.go.id', 'Alamat Email')}
              className={`flex gap-3 ${editableClass}`}
            >
              <Mail size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs font-bold">{data.email || 'samarinda@pom.go.id'}</div>
            </div>
            <div 
              onClick={() => isEditor && onEditField?.('address', data.address || 'Jl. Letjend Soeprapto No.3...', 'Alamat Lengkap')}
              className={`flex gap-3 ${editableClass}`}
            >
              <MapPin size={16} className="text-blue-400 shrink-0 mt-0.5" />
              <div className="text-xs font-medium text-white/50 leading-relaxed">
                {data.address || 'Jl. Letjend Soeprapto No.3, Samarinda, Kalimantan Timur 75123'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
          © 2026 BBPOM DI SAMARINDA. ALL RIGHTS RESERVED.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-colors">Privacy Policy</a>
          <a href="#" className="text-[10px] font-bold text-white/20 hover:text-white uppercase tracking-widest transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
