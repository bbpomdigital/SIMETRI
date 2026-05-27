'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/builder/Navbar';
import { Hero } from '@/components/builder/Hero';
import { IconRow } from '@/components/builder/IconRow';
import { Values } from '@/components/builder/Values';
import { ServiceList } from '@/components/builder/ServiceList';
import { Footer } from '@/components/builder/Footer';
import { FloatingElements } from '@/components/builder/FloatingElements';
import { WebNews } from '@/components/builder/WebNews';
import { FbNews } from '@/components/builder/FbNews';
import { Save, Eye, Plus, Settings, X, Layout, List, Info, Shield, Loader2, ArrowLeft, Globe, User, ArrowUp, ArrowDown, HelpCircle, Undo, Redo, History, Clock, ChevronRight, Newspaper, ThumbsUp } from 'lucide-react';
import SmartIcon from '@/components/builder/SmartIcon';
import Link from 'next/link';
import { updateSiteData, SiteData } from '@/actions/sites';
import { uploadFile } from '@/actions/upload';

export default function EditorClient({ params, initialData }: { params: { id: string }, initialData: any }) {
  const [siteName, setSiteName] = useState(initialData?.site_name || 'My Awesome Website');
  const [currentPage, setCurrentPage] = useState<string>('index');
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redux-style Undo/Redo State Machine with Persistent Storage
  const storageKey = `grafiti_history_${params.id}`;

  const [historyState, setHistoryState] = useState<{
    past: { data: any, label: string, time: string }[];
    present: any;
    future: { data: any, label: string, time: string }[];
  }>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.present) {
            return parsed;
          }
        }
      } catch (e) {
        console.error('Gagal memuat riwayat persisten:', e);
      }
    }
    return {
      past: [],
      present: initialData?.pages_json || { index: [] },
      future: []
    };
  });

  const allPages = historyState.present;
  const components = allPages[currentPage] || [];

  // Persist changes to localStorage whenever historyState updates
  React.useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(historyState));
    } catch (e) {
      console.error('Gagal menyimpan riwayat persisten:', e);
    }
  }, [historyState, storageKey]);

  // Sync database preview image into historyState if it was updated from outside (e.g. Admin Settings)
  React.useEffect(() => {
    const dbPreviewImage = initialData?.pages_json?.preview_image;
    if (dbPreviewImage && allPages && allPages.preview_image !== dbPreviewImage) {
      setHistoryState(prev => {
        const nextPresent = {
          ...prev.present,
          preview_image: dbPreviewImage
        };
        return {
          ...prev,
          present: nextPresent
        };
      });
    }
  }, [initialData, allPages]);

  const setAllPages = (newPages: any | ((prev: any) => any), actionLabel: string = 'Perubahan Konten') => {
    setHistoryState(prev => {
      const nextPages = typeof newPages === 'function' ? newPages(prev.present) : newPages;
      if (JSON.stringify(prev.present) === JSON.stringify(nextPages)) {
        return prev;
      }

      let newPast = [...prev.past, {
        data: prev.present,
        label: actionLabel,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }];

      // Limit history stack to 50 items to keep browser performance super fast
      if (newPast.length > 50) {
        newPast = newPast.slice(newPast.length - 50);
      }

      return {
        past: newPast,
        present: nextPages,
        future: []
      };
    });
  };

  const undo = () => {
    setHistoryState(prev => {
      if (prev.past.length === 0) return prev;
      const last = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);
      return {
        past: newPast,
        present: last.data,
        future: [{ data: prev.present, label: last.label, time: last.time }, ...prev.future]
      };
    });
  };

  const redo = () => {
    setHistoryState(prev => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, { data: prev.present, label: next.label, time: next.time }],
        present: next.data,
        future: newFuture
      };
    });
  };

  const revertToHistory = (index: number) => {
    setHistoryState(prev => {
      const target = prev.past[index];
      const newPast = prev.past.slice(0, index);
      const newFuture = [...prev.past.slice(index + 1), { data: prev.present, label: 'Reverted', time: '' }, ...prev.future];

      return {
        past: newPast,
        present: target.data,
        future: newFuture
      };
    });
  };

  const resetToDatabase = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Sinkron Ulang DB',
      message: 'Apakah Anda yakin ingin membuang semua riwayat lokal di browser ini dan memuat ulang data segar dari database? Tindakan ini tidak bisa dibatalkan.',
      onConfirm: () => {
        setHistoryState({
          past: [],
          present: initialData?.pages_json || { index: [] },
          future: []
        });
        setConfirmConfig(null);
        setShowHistoryModal(false);
      }
    });
  };

  // Keyboard Shortcuts for Undo/Redo
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyState]);

  const [status, setStatus] = useState<'draft' | 'published'>(initialData?.status || 'draft');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showToolbox, setShowToolbox] = useState(false);
  const [showPageManager, setShowPageManager] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [newPageSlug, setNewPageSlug] = useState('');
  const [alertConfig, setAlertConfig] = useState<{ isOpen: boolean, title: string, message: string, type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void } | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [editModal, setEditModal] = useState<{ isOpen: boolean, componentId: string, field: string, value: string, label: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSiteData(params.id, {
        pages_json: allPages,
        status: status
      } as Partial<SiteData>);
      setAlertConfig({ isOpen: true, title: 'Berhasil!', message: 'Website Anda telah disimpan dengan aman.', type: 'success' });
    } catch (error) {
      console.error(error);
      setAlertConfig({ isOpen: true, title: 'Oops!', message: 'Gagal menyimpan perubahan. Silakan coba lagi.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const setComponents = (newComponents: any[] | ((prev: any[]) => any[]), label: string = 'Update Konten') => {
    setAllPages((prev: any) => {
      const currentVal = prev[currentPage] || [];
      const updated = typeof newComponents === 'function' ? newComponents(currentVal) : newComponents;
      return { ...prev, [currentPage]: updated };
    }, label);
  };

  const updateComponentData = (id: string, newData: any, label: string = 'Edit Elemen') => {
    setComponents(prev => prev.map(c => c.id === id ? { ...c, data: { ...c.data, ...newData } } : c), label);
  };

  const openEditModal = (componentId: string, field: string, value: string, label: string) => {
    setEditModal({ isOpen: true, componentId, field, value, label });
  };

  const handleSaveModal = () => {
    if (!editModal) return;

    const labelPrefix = editModal.label;

    if (editModal.field.includes('.')) {
      const parts = editModal.field.split('.');
      const [listName, index, fieldName] = parts;
      const component = components.find((c: any) => c.id === editModal.componentId);
      if (component) {
        let currentList = component.data[listName];
        if (!currentList || currentList.length === 0) {
          if (listName === 'schedule') {
            currentList = [
              { days: 'Senin - Kamis', time: '08.00 - 16.30 WITA' },
              { days: 'Jumat', time: '08.00 - 16.00 WITA' }
            ];
          } else if (listName === 'socialLinks') {
            currentList = [
              { icon: 'Globe', url: '#', label: 'Website' },
              { icon: 'MessageCircle', url: '#', label: 'WhatsApp' }
            ];
          } else {
            currentList = [];
          }
        }

        const newItems = currentList.map((item: any, i: number) => {
          if (i === parseInt(index)) {
            return { ...item, [fieldName]: editModal.value };
          }
          return item;
        });
        updateComponentData(editModal.componentId, { [listName]: newItems }, `Ubah ${labelPrefix}`);
      }
    } else {
      updateComponentData(editModal.componentId, { [editModal.field]: editModal.value }, `Ubah ${labelPrefix}`);
    }
    setEditModal(null);
  };

  const addComponent = (type: string) => {
    const id = `${type}-${Date.now()}`;
    let newData: any = {};
    // ... defaults ...
    if (type === 'values') newData = {
      sectionTitle: 'Fitur Unggulan',
      sectionSubtitle: 'Keunggulan layanan kami untuk Anda',
      items: [{ title: 'Poin Utama', description: 'Deskripsi keunggulan layanan Anda di sini.', icon: 'Shield' }]
    };
    if (type === 'iconrow') newData = { title: 'LAYANAN UTAMA', items: [{ label: 'Utama', icon: 'Home', url: '#' }] };
    if (type === 'footer') newData = {
      aboutTitle: 'BBPOM SAMARINDA',
      aboutText: 'Unit Pelaksana Teknis Badan POM di Samarinda hadir untuk melindungi masyarakat dari obat dan makanan yang berisiko terhadap kesehatan.',
      phone: '(0541) 741492 / 741517',
      email: 'samarinda@pom.go.id',
      address: 'Jl. Letjend Soeprapto No.3, Samarinda, Kalimantan Timur 75123',
      online: '0',
      totalVisits: '1502103',
      schedule: [
        { days: 'Senin - Kamis', time: '08.00 - 16.30 WITA' },
        { days: 'Jumat', time: '08.00 - 16.00 WITA' }
      ],
      socialLinks: [
        { icon: 'Globe', url: '#', label: 'Website' },
        { icon: 'MessageCircle', url: '#', label: 'WhatsApp' }
      ]
    };
    if (type === 'hero') newData = { title: 'JUDUL BARU', subtitle: '(Sub Judul)', description: 'Deskripsi...', badge: 'NEW', buttonUrl: '#' };
    if (type === 'navbar') newData = { brand: 'BRAND', links: [{ id: 'l1', label: 'Home', url: '/' }] };
    if (type === 'servicelist') newData = { items: [{ title: 'Layanan Digital Baru', subtitle: 'Keterangan layanan Anda.', icon: 'Monitor', url: '#' }] };
    if (type === 'webnews') newData = { sectionTitle: 'Berita & Update Terkini', sectionSubtitle: 'BBPOM di Samarinda' };
    if (type === 'fbnews') newData = { sectionTitle: 'Kabar Terbaru Facebook', sectionSubtitle: 'BBPOM di Samarinda' };

    const newComponent = { id, type, data: newData };

    if (insertIndex !== null) {
      const newComponents = [...components];
      newComponents.splice(insertIndex, 0, newComponent);
      setComponents(newComponents, `Tambah Komponen ${type}`);
      setInsertIndex(null);
    } else {
      setComponents(prev => [...prev, newComponent], `Tambah Komponen ${type}`);
    }
    setShowToolbox(false);
  };

  const isCoreComponent = (type: string) => {
    if (currentPage === 'index') {
      return ['navbar', 'hero', 'footer'].includes(type);
    }
    return ['navbar', 'footer'].includes(type);
  };

  const moveComponent = (index: number, direction: 'up' | 'down') => {
    const newComponents = [...components];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    // Protection: Don't move if out of bounds or trying to swap with core components
    if (targetIndex <= 0 || targetIndex >= newComponents.length - 1) return;
    if (isCoreComponent(newComponents[index].type)) return;

    const [moved] = newComponents.splice(index, 1);
    newComponents.splice(targetIndex, 0, moved);
    setComponents(newComponents, 'Ubah Urutan Komponen');
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white text-[#0f172a] overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-[72px] bg-[#0f172a] text-white flex items-center justify-between px-6 shrink-0 z-[1000] border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield size={20} />
          </div>
          <div className="leading-tight">
            <h1 className="font-black text-sm tracking-tight uppercase text-blue-100">SIMETRI BUILDER</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{siteName}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-widest ${status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>
                {status === 'published' ? 'Live' : 'Draft Mode'}
              </span>
            </div>
          </div>
        </div>

        {/* Page Selector */}
        <div className="flex items-center gap-4">
          <div className="max-w-xs">
            <button
              onClick={() => setShowPageManager(true)}
              className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <Layout size={12} />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-white/80">Halaman: {currentPage}</span>
              </div>
              <Settings size={14} className="text-white/20 group-hover:text-white transition-colors" />
            </button>
          </div>

          {/* Undo/Redo/History Button Group */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
            <button
              disabled={historyState.past.length === 0}
              onClick={undo}
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-all"
              title="Undo (Ctrl+Z)"
            >
              <Undo size={15} />
            </button>
            <div className="w-px h-4 bg-white/10 self-center mx-1"></div>
            <button
              disabled={historyState.future.length === 0}
              onClick={redo}
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/5 rounded-lg transition-all"
              title="Redo (Ctrl+Y)"
            >
              <Redo size={15} />
            </button>
            <div className="w-px h-4 bg-white/10 self-center mx-1"></div>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              title="Riwayat Perubahan"
            >
              <History size={15} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
            <ArrowLeft size={14} /> Kembali
          </Link>
          <a
            href={`/view/${params.id}${currentPage === 'index' ? '' : `?p=${currentPage}`}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-bold flex items-center gap-2 transition-all text-white/80"
          >
            <Eye size={14} /> Preview
          </a>
          <button
            onClick={() => setStatus(prev => prev === 'published' ? 'draft' : 'published')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all border shadow-lg ${status === 'published' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-amber-500 text-white border-amber-400'
              }`}
          >
            {status === 'published' ? <Globe size={14} /> : <Shield size={14} />}
            {status === 'published' ? 'PUBLISHED' : 'DRAFT MODE'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-lg"
          >
            {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            {saving ? 'Menyimpan...' : 'Simpan Halaman'}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden relative bg-[#f1f5f9] custom-scrollbar">
        <div className="w-full min-h-full bg-white shadow-sm overflow-x-hidden">
          {components.map((comp: any, index: number) => (
            <React.Fragment key={comp.id}>
              <div
                onClick={() => setSelectedId(comp.id)}
                className={`relative group transition-all border-y border-transparent ${selectedId === comp.id ? 'border-blue-500/50 bg-blue-50/10' : 'hover:border-blue-500/20'}`}
              >
                {comp.type === 'navbar' && (
                  <Navbar
                    data={comp.data}
                    isEditor={true}
                    siteId={params.id}
                    onEditField={(f: string, v: string, l: string) => openEditModal(comp.id, f, v, l)}
                    onAddLink={() => {
                      const newLinks = [...(comp.data.links || []), { id: Date.now().toString(), label: 'Menu Baru', url: '/' }];
                      updateComponentData(comp.id, { links: newLinks });
                    }}
                    onRemoveLink={(linkId: string) => {
                      const newLinks = (comp.data.links || []).filter((l: any) => l.id !== linkId);
                      updateComponentData(comp.id, { links: newLinks });
                    }}
                  />
                )}
                {comp.type === 'hero' && <Hero data={comp.data} isEditor={true} onEditField={(f: string, v: string, l: string) => openEditModal(comp.id, f, v, l)} />}
                {comp.type === 'iconrow' && (
                  <IconRow
                    data={comp.data}
                    isEditor={true}
                    onEditField={(f: string, v: string, l: string, idx?: number) => {
                      if (typeof idx === 'number') {
                        setEditModal({ isOpen: true, componentId: comp.id, field: `items.${idx}.${f}`, value: v, label: `${l} ${idx + 1}` });
                      } else {
                        openEditModal(comp.id, f, v, l);
                      }
                    }}
                    onAddItem={() => {
                      const newItems = [...(comp.data.items || []), { icon: 'Shield', label: 'Layanan Baru', url: '/' }];
                      updateComponentData(comp.id, { items: newItems });
                    }}
                    onRemoveItem={(idx: number) => {
                      const newItems = (comp.data.items || []).filter((_: any, i: number) => i !== idx);
                      updateComponentData(comp.id, { items: newItems });
                    }}
                  />
                )}
                {comp.type === 'values' && (
                  <Values
                    data={comp.data}
                    isEditor={true}
                    onEditField={(f: string, v: string, l: string, idx?: number) => {
                      if (typeof idx === 'number') {
                        const label = `${l} ${idx + 1}`;
                        setEditModal({
                          isOpen: true,
                          componentId: comp.id,
                          field: `items.${idx}.${f}`,
                          value: v,
                          label
                        });
                      } else {
                        openEditModal(comp.id, f, v, l);
                      }
                    }}
                    onAddItem={() => {
                      const newItems = [...(comp.data.items || []), { title: 'Nilai Baru', description: 'Deskripsi nilai baru Anda.', icon: 'Shield' }];
                      updateComponentData(comp.id, { items: newItems });
                    }}
                    onRemoveItem={(idx: number) => {
                      const newItems = (comp.data.items || []).filter((_: any, i: number) => i !== idx);
                      updateComponentData(comp.id, { items: newItems });
                    }}
                  />
                )}
                {comp.type === 'servicelist' && (
                  <ServiceList
                    data={comp.data}
                    isEditor={true}
                    onEditField={(f: string, v: string, l: string, idx?: number) => {
                      if (typeof idx === 'number') {
                        setEditModal({
                          isOpen: true,
                          componentId: comp.id,
                          field: `items.${idx}.${f}`,
                          value: v,
                          label: `${l} ${idx + 1}`
                        });
                      } else {
                        openEditModal(comp.id, f, v, l);
                      }
                    }}
                    onAddItem={() => {
                      const newItems = [...(comp.data.items || []), { title: 'Layanan Baru', subtitle: 'Deskripsi layanan baru Anda.', icon: 'Monitor' }];
                      updateComponentData(comp.id, { items: newItems });
                    }}
                    onRemoveItem={(idx: number) => {
                      const newItems = (comp.data.items || []).filter((_: any, i: number) => i !== idx);
                      updateComponentData(comp.id, { items: newItems });
                    }}
                  />
                )}
                {comp.type === 'webnews' && (
                  <WebNews
                    data={comp.data}
                    isEditor={true}
                    onEditField={(f: string, v: string, l: string) => openEditModal(comp.id, f, v, l)}
                  />
                )}
                {comp.type === 'fbnews' && (
                  <FbNews
                    data={comp.data}
                    isEditor={true}
                    onEditField={(f: string, v: string, l: string) => openEditModal(comp.id, f, v, l)}
                  />
                )}
                {comp.type === 'footer' && (
                  <Footer 
                    data={comp.data} 
                    isEditor={true} 
                    siteId={params.id} 
                    onEditField={(f: string, v: string, l: string, idx?: number) => {
                      if (typeof idx === 'number') {
                        setEditModal({
                          isOpen: true,
                          componentId: comp.id,
                          field: f,
                          value: v,
                          label: l
                        });
                      } else {
                        openEditModal(comp.id, f, v, l);
                      }
                    }}
                    onAddSocial={() => {
                      const newSocials = [...(comp.data.socialLinks || [
                        { icon: 'Globe', url: comp.data.websiteUrl || '#', label: 'Website' },
                        { icon: 'MessageCircle', url: comp.data.waUrl || '#', label: 'WhatsApp' }
                      ]), { icon: 'Globe', url: '#', label: 'Tautan Baru' }];
                      updateComponentData(comp.id, { socialLinks: newSocials });
                    }}
                    onRemoveSocial={(idx: number) => {
                      const currentSocials = comp.data.socialLinks || [
                        { icon: 'Globe', url: comp.data.websiteUrl || '#', label: 'Website' },
                        { icon: 'MessageCircle', url: comp.data.waUrl || '#', label: 'WhatsApp' }
                      ];
                      const newSocials = currentSocials.filter((_: any, i: number) => i !== idx);
                      updateComponentData(comp.id, { socialLinks: newSocials });
                    }}
                  />
                )}

                {/* Control Overlay */}
                {selectedId === comp.id && !isCoreComponent(comp.type) && (
                  <div className="absolute top-4 right-4 z-[100] flex items-center gap-2 animate-in zoom-in-50 duration-200">
                    <div className="flex bg-white rounded-full shadow-xl border border-slate-200 p-1">
                      <button
                        disabled={index <= 1}
                        onClick={(e) => { e.stopPropagation(); moveComponent(index, 'up'); }}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <div className="w-px h-4 bg-slate-200 self-center"></div>
                      <button
                        disabled={index >= components.length - 2}
                        onClick={(e) => { e.stopPropagation(); moveComponent(index, 'down'); }}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); setComponents(prev => prev.filter((c: any) => c.id !== comp.id), `Hapus Seksi ${comp.type}`); setSelectedId(null); }}
                      className="w-8 h-8 bg-red-500 text-white rounded-full shadow-xl shadow-red-500/40 flex items-center justify-center hover:bg-red-600 hover:scale-110 active:scale-95 transition-all border-2 border-white"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                )}
              </div>

              {/* Add Button Below Section (Allow after Navbar up to before Footer) */}
              {index < components.length - 1 && (
                <div className="relative h-12 flex items-center justify-center">
                  <div className="w-full h-px bg-slate-100 absolute"></div>
                  <button
                    onClick={() => { setInsertIndex(index + 1); setShowToolbox(true); }}
                    className="z-10 bg-white border border-slate-200 text-slate-400 w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <FloatingElements 
          links={(allPages[Object.keys(allPages).find(k => k.toLowerCase() === 'index') || 'index'] || [])
            .find((c: any) => c.type === 'navbar')?.data?.links || []} 
          siteId={params.id} 
        />
      </div>

      {/* Page Manager Modal */}
      {showPageManager && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2001] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-2xl p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">Pengelola Halaman</h3>
              <button onClick={() => setShowPageManager(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {Object.keys(allPages).map((pageSlug: string) => (
                <div key={pageSlug} className={`p-5 rounded-[24px] border-2 transition-all flex items-center justify-between ${currentPage === pageSlug ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentPage === pageSlug ? 'bg-blue-600 text-white' : 'bg-white text-slate-400'}`}>
                      <Layout size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-black text-[#0f172a] uppercase tracking-wider">{pageSlug}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {pageSlug === 'index' ? 'Halaman Utama' : `Slug: /${pageSlug}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setCurrentPage(pageSlug); setShowPageManager(false); setSelectedId(null); }}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentPage === pageSlug ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
                    >
                      {currentPage === pageSlug ? 'Sedang Diedit' : 'Buka Editor'}
                    </button>
                    {pageSlug !== 'index' && (
                      <button
                        onClick={() => {
                          setConfirmConfig({
                            isOpen: true,
                            title: 'Hapus Halaman?',
                            message: `Apakah Anda yakin ingin menghapus halaman "${pageSlug}"? Konten di dalamnya akan hilang selamanya.`,
                            onConfirm: () => {
                              setAllPages((prev: any) => {
                                const next = { ...prev };
                                delete next[pageSlug];
                                return next;
                              }, `Hapus Halaman ${pageSlug}`);
                              if (currentPage === pageSlug) setCurrentPage('index');
                              setConfirmConfig(null);
                            }
                          });
                        }}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 transition-all flex items-center justify-center"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <button
                onClick={() => {
                  setShowAddPageModal(true);
                  setNewPageSlug('');
                }}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[2px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
              >
                <Plus size={18} />
                Tambah Halaman Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Add Page Modal */}
      {showAddPageModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[3000] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-md p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">Halaman Baru</h3>
              <button onClick={() => setShowAddPageModal(false)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">Slug Halaman (URL)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-slate-300 font-bold text-sm">/</span>
                  </div>
                  <input
                    autoFocus
                    type="text"
                    placeholder="misal: tentang-kami"
                    value={newPageSlug}
                    onChange={(e) => setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newPageSlug) {
                        // Trigger create logic
                        const btn = document.getElementById('btn-create-page');
                        btn?.click();
                      }
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 pl-8 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic">Gunakan huruf kecil, angka, dan tanda hubung saja.</p>
              </div>

              <button
                id="btn-create-page"
                disabled={!newPageSlug}
                onClick={() => {
                  if (allPages[newPageSlug]) {
                    setAlertConfig({ isOpen: true, title: 'Slug Digunakan', message: 'Halaman dengan alamat ini sudah ada. Silakan gunakan nama lain.', type: 'error' });
                    return;
                  }

                  const navbar = allPages.index.find((c: any) => c.type === 'navbar');
                  const footer = allPages.index.find((c: any) => c.type === 'footer');

                  setAllPages((prev: any) => ({
                    ...prev,
                    [newPageSlug]: [
                      navbar ? { ...navbar, id: `nav-${Date.now()}` } : { id: `nav-${Date.now()}`, type: 'navbar', data: { brand: siteName, links: [] } },
                      footer ? { ...footer, id: `footer-${Date.now()}` } : { id: `footer-${Date.now()}`, type: 'footer', data: { aboutTitle: siteName, online: '0' } }
                    ]
                  }), `Tambah Halaman ${newPageSlug}`);
                  setCurrentPage(newPageSlug);
                  setShowAddPageModal(false);
                  setShowPageManager(false);
                  setSelectedId(null);
                }}
                className="w-full py-5 bg-blue-600 disabled:bg-slate-200 text-white rounded-2xl font-black text-sm uppercase tracking-[1px] hover:bg-blue-700 shadow-xl transition-all"
              >
                Buat Halaman
              </button>
            </div>
          </div>
        </div>
      )}
      {showToolbox && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2001] flex items-center justify-center p-8">
          <div className="bg-white rounded-[40px] w-full max-w-4xl p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">Pilih Komponen</h3>
              <button onClick={() => setShowToolbox(false)} className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { id: 'iconrow', label: 'Layanan Utama', icon: Layout },
                { id: 'values', label: 'FITUR UNGGULAN', icon: Shield },
                { id: 'servicelist', label: 'Daftar Layanan', icon: Info },
                { id: 'webnews', label: 'Berita Website', icon: Newspaper },
                { id: 'fbnews', label: 'Facebook Update', icon: ThumbsUp },
              ].map(item => (
                <button key={item.id} onClick={() => addComponent(item.id)} className="flex flex-col items-center gap-4 p-8 rounded-[32px] bg-slate-50 border-2 border-transparent hover:border-blue-600 hover:bg-blue-50 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <item.icon size={32} />
                  </div>
                  <span className="text-xs font-black text-[#0f172a] uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* THE INDIVIDUAL EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[5000] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-lg max-h-[90vh] flex flex-col p-8 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Modal Header (Sticky di atas) */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">Edit Elemen</h3>
              <button onClick={() => setEditModal(null)} className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{editModal.label}</label>

                {editModal.field.toLowerCase().includes('url') || editModal.field.toLowerCase().includes('link') ? (
                  <div className="space-y-4">
                    <select
                      value={editModal.value.startsWith('http') ? 'external' : 'internal'}
                      onChange={(e) => {
                        const isExternal = e.target.value === 'external';
                        setEditModal({ ...editModal, value: isExternal ? 'https://' : '/' });
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-bold outline-none"
                    >
                      <option value="internal">Halaman Internal (contoh: /profile)</option>
                      <option value="external">Link Eksternal (contoh: https://google.com)</option>
                    </select>
                    <input
                      autoFocus
                      type="text"
                      placeholder={editModal.value.startsWith('http') ? "https://..." : "/..."}
                      value={editModal.value}
                      onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveModal()}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-mono outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                ) : editModal.field.includes('description') || editModal.field.includes('aboutText') ? (
                  <textarea
                    autoFocus
                    value={editModal.value}
                    onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold h-40 outline-none focus:border-blue-500 transition-all"
                  />
                ) : editModal.field.toLowerCase().includes('icon') ? (
                  <div className="space-y-4">
                    {/* Tab Pemilih Ikon */}
                    <div className="border-b border-slate-100 pb-2 mb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pilih Kategori Ikon</p>
                    </div>

                    {/* Grid Ikon Lucide & Google Material */}
                    <div className="space-y-4">
                      {/* Lucide Icons Kategori */}
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Lucide Icons (Bawaan)</span>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { name: 'Shield', label: 'Shield' },
                            { name: 'Star', label: 'Star' },
                            { name: 'CheckCircle', label: 'Check' },
                            { name: 'Users', label: 'Users' },
                            { name: 'Monitor', label: 'Monitor' },
                            { name: 'Settings', label: 'Setting' },
                            { name: 'Search', label: 'Search' },
                            { name: 'Info', label: 'Info' },
                            { name: 'Home', label: 'Home' },
                            { name: 'BookOpen', label: 'Book' },
                          ].map((ico) => {
                            const isSelected = editModal.value === ico.name;
                            return (
                              <button
                                key={ico.name}
                                onClick={() => setEditModal({ ...editModal, value: ico.name })}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                  isSelected 
                                    ? 'bg-blue-50 border-blue-500 text-blue-600 font-bold scale-105 shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                <SmartIcon name={ico.name} size={20} />
                                <span className="text-[8px] truncate max-w-full">{ico.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Google Material Icons Kategori */}
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Google Material Icons</span>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { name: 'material:verified', label: 'Verified' },
                            { name: 'material:security', label: 'Security' },
                            { name: 'material:science', label: 'Science' },
                            { name: 'material:analytics', label: 'Analysis' },
                            { name: 'material:public', label: 'Public' },
                            { name: 'material:medical_services', label: 'Medis/Obat' },
                            { name: 'material:restaurant', label: 'Makanan' },
                            { name: 'material:gavel', label: 'Hukum' },
                            { name: 'material:workspace_premium', label: 'Premium' },
                            { name: 'material:chat', label: 'Chat' },
                          ].map((ico) => {
                            const isSelected = editModal.value === ico.name;
                            return (
                              <button
                                key={ico.name}
                                onClick={() => setEditModal({ ...editModal, value: ico.name })}
                                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                  isSelected 
                                    ? 'bg-blue-50 border-blue-500 text-blue-600 font-bold scale-105 shadow-sm'
                                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                                }`}
                              >
                                <SmartIcon name={ico.name} size={20} />
                                <span className="text-[8px] truncate max-w-full">{ico.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Custom Image Upload / URL Option */}
                    <div className="border-t border-slate-100 pt-4 mt-4 space-y-3">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Kustom Gambar (Opsional)</span>
                      
                      {editModal.value && (editModal.value.startsWith('/') || editModal.value.startsWith('http')) && (
                        <div className="relative w-full h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                          <img src={editModal.value} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            onClick={() => setEditModal({ ...editModal, value: 'Shield' })}
                            className="absolute top-2 right-2 w-6 h-6 bg-white/80 backdrop-blur-sm text-red-500 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-md"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-center py-3 border border-slate-200 rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all text-xs font-bold text-slate-600 gap-1.5">
                          {uploading ? 'Mengupload...' : 'Upload File Gambar'}
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            disabled={uploading}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploading(true);
                              try {
                                const formData = new FormData();
                                formData.append('file', file);
                                const result = await uploadFile(formData);
                                setEditModal({ ...editModal, value: result.url });
                              } catch (error: any) {
                                console.error(error);
                                alert('Gagal upload gambar.');
                              } finally {
                                setUploading(false);
                              }
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Masukkan nilai custom / URL gambar..."
                          value={editModal.value}
                          onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                          className="flex-[1.5] bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-mono outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ) : editModal.field.toLowerCase().includes('image') || editModal.field.toLowerCase().includes('logo') ? (
                  <div className="space-y-4">
                    {editModal.value && (
                      <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                        <img src={editModal.value} alt="Preview" className="w-full h-full object-cover" />
                        <button
                          onClick={() => setEditModal({ ...editModal, value: '' })}
                          className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm text-red-500 rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          {uploading ? (
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                          ) : (
                            <Plus className="w-8 h-8 text-slate-400 mb-2" />
                          )}
                          <p className="text-xs text-slate-500 font-bold">
                            {uploading ? 'Sedang Mengupload...' : 'Klik untuk Upload Gambar'}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          disabled={uploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setUploading(true);
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              const result = await uploadFile(formData);
                              setEditModal({ ...editModal, value: result.url });
                            } catch (error: any) {
                              console.error(error);
                              alert(error.message || 'Gagal upload gambar.');
                            } finally {
                              setUploading(false);
                            }
                          }}
                        />
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Globe size={14} className="text-slate-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Atau masukkan URL gambar luar..."
                          value={editModal.value}
                          onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 pl-10 text-[10px] font-mono outline-none focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <input
                    autoFocus
                    type="text"
                    value={editModal.value}
                    onChange={(e) => setEditModal({ ...editModal, value: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveModal()}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-sm font-bold outline-none focus:border-blue-500 transition-all"
                  />
                )}
              </div>

            </div>

            {/* Modal Footer (Sticky di bawah) */}
            <div className="pt-4 border-t border-slate-100 mt-6 shrink-0">
              <button
                onClick={handleSaveModal}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-[1px] hover:bg-blue-700 shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Simpan Elemen
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Global Alert Modal */}
      {alertConfig?.isOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-10 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className={`w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center ${alertConfig.type === 'success' ? 'bg-emerald-50 text-emerald-500' :
                alertConfig.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
              }`}>
              {alertConfig.type === 'success' ? <Shield size={40} /> : <Info size={40} />}
            </div>
            <h3 className="text-2xl font-black text-[#0f172a] mb-2">{alertConfig.title}</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">{alertConfig.message}</p>
            <button
              onClick={() => setAlertConfig(null)}
              className="w-full py-4 bg-[#0f172a] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2005] flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">Riwayat Sesi</h3>
              <button onClick={() => setShowHistoryModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {/* Present state */}
              <div className="p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20 border-2 border-blue-600 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Sesi Aktif</div>
                    <div className="text-sm font-black uppercase">Versi Terbaru</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-white/20 rounded-lg text-[10px] font-black uppercase">Aktif</div>
              </div>

              {/* Past states in reverse */}
              {[...historyState.past].reverse().map((item, idx) => {
                const actualIndex = historyState.past.length - 1 - idx;
                return (
                  <button
                    key={idx}
                    onClick={() => { revertToHistory(actualIndex); setShowHistoryModal(false); }}
                    className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 hover:border-blue-300 hover:bg-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-100 transition-all">
                        <History size={18} />
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time}</div>
                        <div className="text-sm font-black text-[#0f172a] uppercase">{item.label}</div>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                      <ChevronRight size={14} />
                    </div>
                  </button>
                );
              })}

              {historyState.past.length === 0 && (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto mb-4 flex items-center justify-center text-slate-200">
                    <History size={32} />
                  </div>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Belum ada riwayat perubahan</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <span>{historyState.past.length} Perubahan Tercatat</span>
              <button
                onClick={resetToDatabase}
                className="text-red-500 hover:text-red-600 transition-colors uppercase font-black"
              >
                Reset ke Database
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Confirm Modal */}
      {confirmConfig?.isOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-10 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-500 mx-auto mb-6 flex items-center justify-center">
              <HelpCircle size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#0f172a] mb-2">{confirmConfig.title}</h3>
            <p className="text-slate-500 font-medium mb-8 leading-relaxed">{confirmConfig.message}</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setConfirmConfig(null)}
                className="py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Batal
              </button>
              <button
                onClick={confirmConfig.onConfirm}
                className="py-4 bg-red-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
