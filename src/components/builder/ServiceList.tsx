'use client';

import SmartIcon from '@/components/builder/SmartIcon';
import { ChevronRight, Monitor, Plus, X } from 'lucide-react';

export const ServiceList = ({ data, isEditor, onEditField, onAddItem, onRemoveItem }: { 
  data: any,
  isEditor?: boolean,
  onEditField?: (field: string, value: string, label: string, index?: number) => void,
  onAddItem?: () => void,
  onRemoveItem?: (index: number) => void
}) => {
  const editableClass = isEditor ? "cursor-pointer hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5 rounded-lg transition-all px-2 -mx-2" : "";

  const renderItem = (item: any, i: number) => {
    const hasLink = item.url && item.url !== '#' && item.url.trim() !== '';
    const interactiveClass = (hasLink || isEditor) ? 'cursor-pointer hover:shadow-md hover:border-blue-100/50' : 'cursor-default';

    const content = (
      <div key={i} className={`relative bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-6 group transition-all ${interactiveClass}`}>
        {isEditor && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRemoveItem?.(i); }}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 transition-all shadow-xl z-10 hover:bg-red-600 hover:scale-110 active:scale-90 border-2 border-white"
          >
            <X size={14} strokeWidth={3} />
          </button>
        )}
        <div 
          onClick={() => isEditor && onEditField?.('icon', item.icon, 'Icon (Contoh: Monitor, Search, material:security, material:verified, atau URL Gambar)', i)}
          className="w-16 h-16 bg-[#f8fafc] rounded-2xl flex items-center justify-center text-[#cbd5e1] group-hover:bg-blue-50 group-hover:text-[#3b82f6] transition-all overflow-hidden shrink-0"
        >
          <SmartIcon name={item.icon} size={28} className="text-[#3b82f6]" fallback={Monitor} />
        </div>
        <div className="flex-1">
          <h4 
            onClick={() => isEditor && onEditField?.('title', item.title, 'Judul Layanan', i)}
            className={`text-lg font-black text-[#0f172a] group-hover:text-[#3b82f6] transition-colors ${editableClass}`}
          >
            {item.title}
          </h4>
          <p 
            onClick={() => isEditor && onEditField?.('subtitle', item.subtitle, 'Sub-judul Layanan', i)}
            className={`text-xs font-medium text-slate-500 leading-relaxed mt-2 ${editableClass}`}
          >
            {item.subtitle}
          </p>
          {isEditor && (
            <div 
              onClick={() => onEditField?.('url', item.url || '#', 'Link Tujuan Layanan', i)}
              className="mt-2 text-[9px] font-mono text-blue-500/60 hover:text-blue-600 flex items-center gap-1 overflow-hidden"
            >
              <Plus size={8} /> Link: {item.url || '#'}
            </div>
          )}
        </div>
        {(hasLink || isEditor) && (
          <div className="text-red-500 opacity-60 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={24} strokeWidth={3} />
          </div>
        )}
      </div>
    );

    if (isEditor) return content;
    
    if (hasLink) {
      return (
        <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block">
          {content}
        </a>
      );
    }

    return <div key={i} className="block">{content}</div>;
  };

  return (
    <section className="py-12 px-6 bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto">
        {/* Section Title Header */}
        {((data.sectionTitle !== '' || data.sectionSubtitle !== '') || isEditor) && (
          <div className="mb-8 text-center">
            {(data.sectionSubtitle !== '' || isEditor) && (
              <span 
                onClick={() => isEditor && onEditField?.('sectionSubtitle', data.sectionSubtitle !== undefined ? data.sectionSubtitle : 'Layanan Publik', 'Sub-judul Seksi')}
                className={`block text-[10px] font-bold text-blue-600 tracking-[2px] mb-1.5 ${editableClass} ${
                  isEditor && data.sectionSubtitle === '' ? 'text-slate-300/60 border border-dashed border-slate-200/50 px-2 py-0.5 rounded inline-block normal-case font-normal' : ''
                }`}
              >
                {isEditor && data.sectionSubtitle === '' ? '[Sub-judul Seksi Kosong]' : (data.sectionSubtitle !== undefined ? data.sectionSubtitle : 'Layanan Publik')}
              </span>
            )}
            {(data.sectionTitle !== '' || isEditor) && (
              <h2 
                onClick={() => isEditor && onEditField?.('sectionTitle', data.sectionTitle !== undefined ? data.sectionTitle : 'Daftar Layanan Digital', 'Judul Seksi')}
                className={`text-2xl font-black tracking-tight text-slate-900 ${editableClass} ${
                  isEditor && data.sectionTitle === '' ? 'text-slate-300 italic border border-dashed border-slate-200/50 px-3 py-1 rounded inline-block text-sm font-normal' : ''
                }`}
              >
                {isEditor && data.sectionTitle === '' ? '[Judul Seksi Kosong]' : (data.sectionTitle !== undefined ? data.sectionTitle : 'Daftar Layanan Digital')}
              </h2>
            )}
          </div>
        )}

        <div className="space-y-4">
          {(data.items || []).map((item: any, i: number) => renderItem(item, i))}

          {isEditor && (
            <button 
              onClick={onAddItem}
              className="w-full py-6 rounded-[24px] border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <Plus size={20} />
              </div>
              Tambah Layanan
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
