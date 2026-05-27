'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Loader2, X, File, Shield, Briefcase, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createNewSite } from '@/actions/sites';

const templates = [
  { id: 'empty', name: 'Kosong', desc: 'Mulai dari kanvas putih bersih', icon: File, color: 'text-slate-400' },
  { id: 'perisai', name: 'Perisai Mahakam', desc: 'Layout portal layanan publik lengkap', icon: Shield, color: 'text-blue-500' },
  { id: 'business', name: 'Profil Bisnis', desc: 'Desain korporat modern & elegan', icon: Briefcase, color: 'text-slate-900' },
];

export default function CreateSiteButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('empty');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setLoading(true);
    try {
      const result = await createNewSite(name, selectedTemplate);
      if (result.success && result.site) {
        setIsOpen(false);
        setName('');
        // Redirect directly to the Visual Editor for a flawless SaaS UX
        router.push(`/admin/edit/${result.site.id}`);
      }
    } catch (error: any) {
      console.error(error);
      alert('Gagal membuat website: ' + (error.message || JSON.stringify(error)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
      >
        <Plus size={16} />
        Buat Website Baru
      </button>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0d1325] border border-white/10 rounded-[28px] w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between bg-white/[0.01]">
              <h3 className="text-sm font-black text-white">Pilih Template Website</h3>
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                type="button"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-5">
              {/* Input Nama Proyek */}
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-white/35 uppercase tracking-widest">Nama Proyek Website</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Website Desa Sejahtera" 
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-white/20"
                  required 
                />
              </div>

              {/* Template Selector */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-white/35 uppercase tracking-widest">Pilih Desain Awal</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {templates.map((t) => {
                    const isSelected = selectedTemplate === t.id;
                    return (
                      <div 
                        key={t.id} 
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`relative cursor-pointer h-full p-4 border rounded-xl text-center transition-all bg-white/[0.01] ${
                          isSelected 
                            ? 'border-blue-500/50 bg-blue-500/10' 
                            : 'border-white/[0.06] hover:border-white/15'
                        }`}
                      >
                        <div className={`mb-2 flex justify-center transition-colors ${isSelected ? 'text-blue-400' : 'text-white/30'}`}>
                          <t.icon size={22} />
                        </div>
                        <h4 className="font-black text-[11px] text-white mb-0.5">{t.name}</h4>
                        <p className="text-[8px] leading-normal text-white/20 line-clamp-2">{t.desc}</p>
                        
                        {isSelected && (
                          <div className="absolute top-1.5 right-1.5 text-blue-400">
                            <Check size={11} strokeWidth={3.5} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-white/[0.05]">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2.5 text-white/30 hover:text-white font-bold text-xs uppercase tracking-widest hover:bg-white/5 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" size={14} /> : 'Konfirmasi & Buat Halaman'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
