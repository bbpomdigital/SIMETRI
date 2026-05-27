'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface NavbarProps {
  data: {
    brand?: string;
    logo?: string;
    links: { id: string; label: string; url: string }[];
  };
  isEditor?: boolean;
  siteId?: string;
  onEditField?: (field: string, value: string, label: string) => void;
  onAddLink?: () => void;
  onRemoveLink?: (id: string) => void;
}

export const Navbar = ({ data, isEditor, siteId, onEditField, onAddLink, onRemoveLink }: NavbarProps) => {
  const editableClass = isEditor ? "cursor-pointer hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5 rounded-lg transition-all px-2 -mx-2" : "";

  const getFormattedUrl = (urlStr: string) => {
    if (!urlStr) return '#';
    
    // Check if external link
    if (urlStr.startsWith('http://') || urlStr.startsWith('https://') || urlStr.startsWith('mailto:') || urlStr.startsWith('tel:')) {
      return urlStr;
    }
    
    // Internal link slug mapping
    let slug = urlStr;
    if (slug.startsWith('/')) {
      slug = slug.substring(1);
    }
    if (!slug || slug === 'index') {
      return siteId ? `/view/${siteId}` : '?p=index';
    }
    
    return siteId ? `/view/${siteId}?p=${slug}` : `?p=${slug}`;
  };

  return (
    <nav className={`h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between z-[100] shadow-sm ${isEditor ? 'relative' : 'sticky top-0'}`}>
      <div className="flex items-center gap-3">
        <div 
          onClick={() => isEditor && onEditField?.('logo', data.logo || '', 'Logo Gambar')}
          className={`w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-blue-500/20 flex-shrink-0 flex items-center justify-center ${isEditor ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all' : ''}`}
        >
          {data.logo ? (
            <img src={data.logo} alt="Logo" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-green-400 to-blue-500"></div>
          )}
        </div>
        <div className="leading-none">
          <span 
            onClick={() => isEditor && onEditField?.('brand', data.brand || '', 'Nama Brand')}
            className={`block text-xl font-black text-[#0f172a] tracking-tighter uppercase ${editableClass}`}
          >
            {(data.brand && data.brand.toUpperCase() === 'GRAFITI') ? 'SIMETRI' : (data.brand || 'SIMETRI')}
          </span>
          <span className="block text-[8px] font-black text-blue-600 uppercase tracking-[1px]">BBPOM SAMARINDA</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6">
          {(data.links || []).map((link: any, idx: number) => (
            <div key={link.id} className="relative flex flex-col items-center group/menu px-2">
              {isEditor && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onRemoveLink?.(link.id); }}
                  className="absolute -top-2 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold opacity-0 group-hover/menu:opacity-100 transition-opacity shadow-lg z-10"
                >
                  ×
                </button>
              )}
              
              {!isEditor ? (
                <a 
                  href={getFormattedUrl(link.url)}
                  className="text-xs font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <span 
                  onClick={() => onEditField?.(`links.${idx}.label`, link.label, 'Label Menu')}
                  className={`text-xs font-black text-slate-500 hover:text-blue-600 uppercase tracking-widest transition-colors ${editableClass}`}
                >
                  {link.label}
                </span>
              )}

              {isEditor && (
                <span 
                  onClick={() => onEditField?.(`links.${idx}.url`, link.url, 'Link Tujuan Menu')}
                  className="mt-1 px-1.5 py-0.5 bg-blue-500/5 border border-blue-500/10 rounded-full text-[7px] font-mono text-blue-400/80 cursor-pointer hover:bg-blue-500/10 transition-all flex items-center gap-1"
                >
                  <ExternalLink size={8} />
                  {link.url.length > 15 ? link.url.substring(0, 15) + '...' : link.url}
                </span>
              )}
            </div>
          ))}
          {isEditor && (
            <button 
              onClick={onAddLink}
              className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all border border-dashed border-blue-200"
            >
              <span className="text-xl leading-none">+</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
