'use client';

import SmartIcon from '@/components/builder/SmartIcon';
import { Shield, Plus, X } from 'lucide-react';

export const Values = ({ data, isEditor, onEditField, onAddItem, onRemoveItem }: { 
  data: any, 
  isEditor?: boolean, 
  onEditField?: (field: string, value: string, label: string, index?: number) => void,
  onAddItem?: () => void,
  onRemoveItem?: (index: number) => void
}) => {
  const editableClass = isEditor ? "cursor-pointer hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5 rounded-xl transition-all p-2 -m-2" : "";

  return (
    <section className="py-12 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Title Header */}
        {((data.sectionTitle !== '' || data.sectionSubtitle !== '') || isEditor) && (
          <div className="mb-8 text-center">
            {(data.sectionTitle !== '' || isEditor) && (
              <h2 
                onClick={() => isEditor && onEditField?.('sectionTitle', data.sectionTitle !== undefined ? data.sectionTitle : 'Fitur Unggulan', 'Judul Seksi')}
                className={`text-4xl font-black text-[#0f172a] tracking-tight mb-4 ${editableClass} inline-block ${
                  isEditor && data.sectionTitle === '' ? 'text-slate-300 italic border border-dashed border-slate-200/50 px-3 py-1 rounded text-sm font-normal' : ''
                }`}
              >
                {isEditor && data.sectionTitle === '' ? '[Judul Seksi Kosong]' : (data.sectionTitle !== undefined ? data.sectionTitle : 'Fitur Unggulan')}
              </h2>
            )}
            {(data.sectionSubtitle !== '' || isEditor) && (
              <p 
                onClick={() => isEditor && onEditField?.('sectionSubtitle', data.sectionSubtitle !== undefined ? data.sectionSubtitle : 'Keunggulan layanan kami untuk Anda', 'Sub-judul Seksi')}
                className={`text-slate-500 font-bold tracking-[2px] text-xs ${editableClass} block mt-2 ${
                  isEditor && data.sectionSubtitle === '' ? 'text-slate-300/60 border border-dashed border-slate-200/50 px-2 py-0.5 rounded normal-case font-normal inline-block' : ''
                }`}
              >
                {isEditor && data.sectionSubtitle === '' ? '[Sub-judul Seksi Kosong]' : (data.sectionSubtitle !== undefined ? data.sectionSubtitle : 'Keunggulan layanan kami untuk Anda')}
              </p>
            )}
          </div>
        )}
        <div className="flex md:flex md:flex-row md:flex-wrap md:justify-center md:items-stretch gap-8 overflow-x-auto md:overflow-x-visible pb-12 md:pb-0 scroll-smooth snap-x snap-mandatory -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
          {(data.items || []).map((item: any, i: number) => {
            return (
              <div key={i} className="relative min-w-[280px] md:min-w-0 md:w-[280px] bg-white p-8 rounded-[32px] border border-slate-50 shadow-sm hover:shadow-xl transition-all text-center group/card snap-center flex flex-col items-center">
                {isEditor && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemoveItem?.(i); }}
                    className="absolute top-2 left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-100 transition-all shadow-xl z-20 hover:bg-red-600 hover:scale-110 active:scale-90 border-2 border-white"
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                )}
                <div 
                  onClick={() => isEditor && onEditField?.('icon', item.icon, 'Icon (Contoh: Shield, Star, material:security, material:verified, atau URL Gambar)', i)}
                  className="w-20 h-20 bg-[#f8fafc] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-50 transition-all cursor-pointer overflow-hidden shrink-0"
                >
                  <SmartIcon name={item.icon} size={32} className="text-[#3b82f6]" fallback={Shield} />
                </div>
                <h4 
                  onClick={() => isEditor && onEditField?.('title', item.title, 'Judul Nilai', i)}
                  className={`text-xl font-black text-[#0f172a] mb-4 min-h-[3.5rem] flex items-center justify-center w-full ${editableClass}`}
                >
                  {item.title}
                </h4>
                <p 
                  onClick={() => isEditor && onEditField?.('description', item.description, 'Deskripsi Nilai', i)}
                  className={`text-sm text-[#64748b] leading-relaxed font-medium ${editableClass} mt-2 flex-1`}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
 
          {isEditor && (
            <div 
              onClick={onAddItem}
              className="min-w-[280px] md:min-w-0 md:w-[280px] bg-white p-8 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer group min-h-[300px] snap-center"
            >
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
                <Plus size={32} />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Tambah Nilai</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
