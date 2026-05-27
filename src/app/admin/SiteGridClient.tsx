'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Edit3, ExternalLink, Trash2, Shield, Settings, X, Loader2, Upload, Users, BarChart3, ToggleLeft, ToggleRight, Check, Eye, Calendar } from 'lucide-react';
import { updateSiteData, deleteSite, getRealStats, SiteData } from '@/actions/sites';
import { uploadFile } from '@/actions/upload';
import { useTheme } from '@/components/ThemeProvider';

interface SiteGridClientProps {
  initialSites: SiteData[];
}

export default function SiteGridClient({ initialSites }: SiteGridClientProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [sites, setSites] = useState<SiteData[]>(initialSites);
  const [selectedSite, setSelectedSite] = useState<SiteData | null>(null);
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState<'draft' | 'published'>('draft');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total: number, online: number } | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (selectedSite) {
      setEditName(selectedSite.site_name);
      setEditStatus(selectedSite.status);
      setPreviewImage(selectedSite.pages_json?.preview_image || null);
      setLoadingStats(true);
      setStats(null);
      getRealStats(selectedSite.id)
        .then(res => setStats(res))
        .catch(() => setStats({ total: 0, online: 0 }))
        .finally(() => setLoadingStats(false));
    }
  }, [selectedSite?.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedSite) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await uploadFile(formData);
      if (uploadRes?.url) {
        setPreviewImage(uploadRes.url);
        const updatedPagesJson = { ...(selectedSite.pages_json || {}), preview_image: uploadRes.url };
        await updateSiteData(selectedSite.id, { pages_json: updatedPagesJson });
        setSites(prev => prev.map(s => s.id === selectedSite.id ? { ...s, pages_json: updatedPagesJson } : s));
        setSelectedSite(prev => prev ? { ...prev, pages_json: updatedPagesJson } : null);
      }
    } catch (error: any) {
      alert('Gagal mengunggah: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedSite || !editName) return;
    setSaving(true);
    try {
      const updates = { site_name: editName, status: editStatus };
      await updateSiteData(selectedSite.id, updates);
      setSites(prev => prev.map(s => s.id === selectedSite.id ? { ...s, ...updates } : s));
      setSelectedSite(null);
    } catch (error: any) {
      alert('Gagal menyimpan: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSite = async () => {
    if (!selectedSite) return;
    setDeleting(true);
    try {
      await deleteSite(selectedSite.id);
      setSites(prev => prev.filter(s => s.id !== selectedSite.id));
      setSelectedSite(null);
      setShowConfirmDelete(false);
    } catch (error: any) {
      alert('Gagal menghapus: ' + error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* ── SITE CARDS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sites.map((site) => {
          const thumbnail = site.pages_json?.preview_image;
          const isPublished = site.status === 'published';

          return (
            <div
              key={site.id}
              className={`group relative flex flex-col border rounded-3xl overflow-hidden transition-all duration-300 ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50'
                  : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 hover:bg-white/[0.05]'
              }`}
            >
              {/* Status pill */}
              <div className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                isPublished
                  ? isLight ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                  : isLight ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white/5 text-white/30 border-white/10'
              }`}>
                {isPublished && <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />}
                {isPublished ? 'Published' : 'Draft'}
              </div>

              {/* Thumbnail */}
              <div
                onClick={() => setSelectedSite(site)}
                className="relative h-44 bg-gradient-to-br from-white/[0.04] to-transparent cursor-pointer overflow-hidden"
              >
                {thumbnail ? (
                  <img src={thumbnail} alt={site.site_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400/60 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-all duration-300">
                      <Globe size={26} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white/40 transition-colors">Klik untuk Detail</span>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1e] via-[#0a0f1e]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 text-xs font-black uppercase tracking-widest">
                    <Settings size={12} /> Detail & Pengaturan
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className={`text-base font-black tracking-tight mb-2 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{site.site_name}</h3>

                <div className={`flex items-center gap-2 mb-4 rounded-xl px-3 py-2 border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/[0.04] border-white/[0.06]'}`}>
                  <Globe size={11} className="text-blue-400 shrink-0" />
                  <span className="text-[10px] text-blue-400/80 font-bold font-mono truncate flex-1">/view/{site.id.slice(0, 18)}...</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/admin/edit/${site.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                  >
                    <Edit3 size={13} /> Editor
                  </Link>
                  <Link
                    href={`/view/${site.id}`}
                    target="_blank"
                    title="Lihat Website Publik"
                    className="p-3 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 rounded-xl transition-all active:scale-95"
                  >
                    <ExternalLink size={16} />
                  </Link>
                  <button
                    onClick={() => { setSelectedSite(site); setShowConfirmDelete(true); }}
                    title="Hapus"
                    className={`p-3 rounded-xl transition-all active:scale-95 border ${isLight ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200' : 'bg-white/[0.04] border-white/[0.08] text-white/30 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20'}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {sites.length === 0 && (
        <div className={`h-72 flex flex-col items-center justify-center text-center border-2 border-dashed rounded-3xl ${isLight ? 'border-slate-200 text-slate-300' : 'border-white/10 text-white/20'}`}>
          <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-4 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/10'}`}>
            <Globe size={32} />
          </div>
          <p className={`font-black ${isLight ? 'text-slate-400' : 'text-white/40'}`}>Belum ada website.</p>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-300' : 'text-white/20'}`}>Klik "Buat Website Baru" untuk memulai.</p>
        </div>
      )}

      {/* ── DETAIL MODAL ── */}
      {selectedSite && !showConfirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0d1325] border border-white/10 rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-white/[0.07] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Settings size={17} />
                </div>
                <div>
                  <h3 className="text-sm font-black">Detail & Pengaturan Website</h3>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mt-0.5">ID: {selectedSite.app_id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSite(null)} className="p-2 rounded-xl text-white/30 hover:text-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Sedang Online', val: stats?.online ?? 0, icon: Users, color: 'blue' },
                  { label: 'Total Kunjungan', val: stats?.total ?? 0, icon: BarChart3, color: 'emerald' },
                ].map(({ label, val, icon: Icon, color }) => (
                  <div key={label} className={`p-4 rounded-2xl bg-${color}-500/5 border border-${color}-500/10 flex items-center gap-3`}>
                    <div className={`w-9 h-9 rounded-xl bg-${color}-500/15 flex items-center justify-center text-${color}-400`}>
                      {loadingStats ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
                    </div>
                    <div>
                      <div className="text-xl font-black">{loadingStats ? '—' : val}</div>
                      <div className="text-[9px] font-bold text-white/25 uppercase tracking-widest">{label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Settings form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Thumbnail */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Gambar Preview</label>
                  <div className="relative group/thumb border border-dashed border-white/15 rounded-2xl h-40 overflow-hidden bg-white/[0.02] flex flex-col items-center justify-center hover:border-blue-500/40 hover:bg-blue-500/5 transition-all cursor-pointer">
                    {previewImage ? (
                      <>
                        <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                          <Upload size={18} />
                          <span className="text-[10px] font-black uppercase tracking-wider">Ganti Gambar</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/20">
                        <Upload size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Unggah Thumbnail</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" disabled={uploading} />
                    {uploading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-2 text-white">
                        <Loader2 className="animate-spin text-blue-400" size={20} />
                        <span className="text-[10px] font-black uppercase">Mengunggah...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Meta fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Nama Website</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 outline-none transition-all text-white placeholder:text-white/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Status Publikasi</label>
                    <div
                      onClick={() => setEditStatus(prev => prev === 'published' ? 'draft' : 'published')}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        editStatus === 'published'
                          ? 'bg-emerald-500/10 border-emerald-500/25'
                          : 'bg-white/[0.03] border-white/10'
                      }`}
                    >
                      {editStatus === 'published'
                        ? <ToggleRight size={36} className="text-emerald-400" strokeWidth={1.5} />
                        : <ToggleLeft size={36} className="text-white/25" strokeWidth={1.5} />
                      }
                      <div>
                        <div className={`text-xs font-black ${editStatus === 'published' ? 'text-emerald-300' : 'text-white/30'}`}>
                          {editStatus === 'published' ? 'Diterbitkan' : 'Draft'}
                        </div>
                        <p className="text-[9px] text-white/20 mt-0.5">
                          {editStatus === 'published' ? 'Dapat diakses publik' : 'Hanya via editor'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Section */}
              <div className="flex flex-col sm:flex-row items-center gap-5 p-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl">
                <div className="bg-white p-2.5 rounded-xl shrink-0">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/view/${selectedSite.id}` : '')}`}
                    alt="QR Code"
                    className="w-24 h-24"
                  />
                </div>
                <div className="flex-1 space-y-3 w-full">
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest">QR Code Link Publik</h4>
                    <p className="text-[10px] text-white/25 font-medium mt-1">Scan untuk akses langsung website versi publik.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl p-2.5">
                    <span className="flex-1 text-[10px] text-blue-400 font-mono font-bold truncate">
                      {typeof window !== 'undefined' ? `${window.location.origin}/view/${selectedSite.id}` : ''}
                    </span>
                    <button
                      onClick={() => {
                        const url = typeof window !== 'undefined' ? `${window.location.origin}/view/${selectedSite.id}` : '';
                        navigator.clipboard.writeText(url);
                      }}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all shrink-0"
                    >
                      Salin
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-white/[0.07] flex items-center justify-between">
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95"
              >
                <Trash2 size={13} /> Hapus
              </button>
              <div className="flex gap-3">
                <button onClick={() => setSelectedSite(null)} className="px-5 py-2.5 text-white/30 hover:text-white hover:bg-white/5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
                  Batal
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={saving || !editName}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 active:scale-95"
                >
                  {saving ? <Loader2 className="animate-spin" size={13} /> : <Check size={13} />}
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM ── */}
      {showConfirmDelete && selectedSite && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0d1325] border border-white/10 rounded-[32px] w-full max-w-sm p-10 shadow-2xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/20 text-red-400 mx-auto mb-5 flex items-center justify-center">
              <Trash2 size={30} />
            </div>
            <h3 className="text-xl font-black mb-2">Hapus Website?</h3>
            <p className="text-white/30 text-xs leading-relaxed mb-7">
              Website <span className="font-black text-white/60">"{selectedSite.site_name}"</span> akan dihapus permanen beserta semua datanya.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setShowConfirmDelete(false)} className="py-3.5 bg-white/5 border border-white/10 text-white/50 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95">
                Batal
              </button>
              <button
                onClick={handleDeleteSite}
                disabled={deleting}
                className="py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {deleting ? <Loader2 className="animate-spin" size={13} /> : null}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
