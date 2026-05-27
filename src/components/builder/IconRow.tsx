'use client';

import SmartIcon from '@/components/builder/SmartIcon';
import { Shield, ExternalLink, Plus, X } from 'lucide-react';

export const IconRow = ({ data, isEditor, onEditField, onAddItem, onRemoveItem }: { 
  data: any, 
  isEditor?: boolean, 
  onEditField?: (field: string, value: string, label: string, index?: number) => void,
  onAddItem?: () => void,
  onRemoveItem?: (index: number) => void
}) => {
  const editableClass = isEditor ? "cursor-pointer hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5 rounded-lg transition-all px-2 -mx-2" : "";

  return (
    <div className="relative z-20 px-6 mt-4 md:-mt-12 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
      <div className="max-w-6xl mx-auto bg-white rounded-[32px] p-6 md:p-8 pb-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100">
        {(data.title !== '' || isEditor) && (
          <div className="text-center mb-8">
            <h3 
              onClick={() => isEditor && onEditField?.('title', data.title !== undefined ? data.title : 'LAYANAN UTAMA', 'Judul Seksi')}
              className={`text-[10px] font-black text-slate-400 uppercase tracking-[3px] ${editableClass} ${
                isEditor && data.title === '' ? 'text-slate-300/60 border border-dashed border-slate-200/50 px-2 py-0.5 rounded normal-case font-normal inline-block' : ''
              }`}
            >
              {isEditor && data.title === '' ? '[Judul Seksi Kosong]' : (data.title !== undefined ? data.title : 'LAYANAN UTAMA')}
            </h3>
          </div>
        )}
        
        <div className="flex md:grid md:grid-cols-6 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12 overflow-x-auto pb-6 md:pb-0 scrollbar-hide snap-x">
          {(data.items || []).map((item: any, idx: number) => {
            const content = (
              <div 
                className="relative flex flex-col items-center group/item min-w-[85px] max-w-[100px] md:max-w-none md:min-w-0 shrink-0"
              >
                <div className="relative">
                  {isEditor && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onRemoveItem?.(idx); }}
                      className="absolute top-0 right-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-all shadow-xl z-50 hover:bg-red-600 hover:scale-110 active:scale-90 border-2 border-white"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  )}
                  {/* Icon container - Interactive only if link is present or inside editor */}
                  {
                    (() => {
                      const hasLink = item.url && item.url !== '#' && item.url.trim() !== '';
                      const interactiveIconClass = (hasLink || isEditor)
                        ? 'cursor-pointer group-hover/item:from-blue-600 group-hover/item:to-indigo-600 group-hover/item:text-white group-hover/item:shadow-[0_12px_24px_rgba(37,99,235,0.3)] group-hover/item:-translate-y-1'
                        : 'cursor-default';

                      return (
                        <div 
                          onClick={() => isEditor && onEditField?.('icon', item.icon || 'Shield', 'Icon (Contoh: Shield, BookOpen, material:verified, material:security, atau URL Gambar)', idx)}
                          className={`w-14 h-14 md:w-16 md:h-16 rounded-[22px] bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100/50 text-blue-600 flex items-center justify-center mb-3 transition-all duration-500 overflow-hidden relative shadow-sm ${interactiveIconClass}`}
                        >
                          <SmartIcon name={item.icon || 'Shield'} size={24} className="text-blue-600 group-hover/item:text-white transition-colors" fallback={Shield} />
                        </div>
                      );
                    })()
                  }
                </div>
                <div className="flex flex-col items-center gap-1 max-w-[95px] md:max-w-none w-full px-1">
                  <span 
                    onClick={() => isEditor && onEditField?.('label', item.label || '', 'Label Layanan', idx)}
                    className={`text-[9px] md:text-[11.5px] font-bold text-slate-700 tracking-tight text-center leading-tight line-clamp-2 min-h-[2.5rem] flex items-center justify-center w-full ${editableClass}`}
                    title={item.label}
                  >
                    {item.label}
                  </span>
                  {isEditor && (
                    <span 
                      onClick={() => onEditField?.('url', item.url || '#', 'Link Tujuan Layanan', idx)}
                      className="px-1.5 py-0.5 bg-blue-500/5 border border-blue-500/10 rounded-full text-[7px] font-mono text-blue-400/80 cursor-pointer hover:bg-blue-500/10 transition-all flex items-center gap-1"
                    >
                      <ExternalLink size={8} />
                      URL
                    </span>
                  )}
                </div>
              </div>
            );

            const hasLink = item.url && item.url !== '#' && item.url.trim() !== '';

            if (isEditor) return <div key={idx} className="shrink-0 snap-center">{content}</div>;
            
            if (hasLink) {
              return (
                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block shrink-0 snap-center">
                  {content}
                </a>
              );
            }

            return <div key={idx} className="shrink-0 snap-center">{content}</div>;
          })}
          
          {isEditor && (
            <button 
              onClick={onAddItem}
              className="flex flex-col items-center justify-center group min-w-[85px] md:min-w-0 shrink-0"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl border-2 border-dashed border-slate-200 text-slate-300 flex items-center justify-center mb-3 group-hover:border-blue-500 group-hover:text-blue-500 transition-all">
                <Plus size={24} />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase">Tambah</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
