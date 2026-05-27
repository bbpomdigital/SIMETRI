'use client';

import React, { useState, useEffect } from 'react';
import { Home, MessageCircle, HelpCircle, Info, LayoutGrid } from 'lucide-react';

const iconMap: any = {
  'Utama': Home,
  'Home': Home,
  'FAQ': HelpCircle,
  'Layanan': LayoutGrid,
  'Tentang': Info,
  'Kontak': MessageCircle,
};

export const FloatingElements = ({ links = [], siteId }: { links?: any[], siteId?: string }) => {
  const [currentTab, setCurrentTab] = useState('index');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCurrentTab(params.get('p') || 'index');
    }
  }, []);

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
    <>
      {/* Dynamic Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-4 py-3 z-[999] md:hidden flex justify-around items-end pb-6 shadow-[0_-10px_20px_rgba(0,0,0,0.03)]">
        {links.slice(0, 4).map((link, idx) => {
          const Icon = iconMap[link.label] || iconMap[Object.keys(iconMap).find(k => link.label.includes(k)) || 'Home'] || Home;
          
          const linkSlug = link.url ? (link.url.startsWith('/') ? link.url.substring(1) : link.url) : 'index';
          const isActive = currentTab === (linkSlug || 'index');
          
          return (
            <a 
              key={link.id || idx} 
              href={getFormattedUrl(link.url)}
              className="flex flex-col items-center gap-1 min-w-[60px] no-underline group cursor-pointer"
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                  : 'text-slate-400 group-hover:text-blue-600 group-hover:bg-slate-50'
              }`}>
                <Icon size={22} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={`text-[9px] font-black uppercase tracking-tighter transition-all duration-300 ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-slate-400 group-hover:text-blue-600'
              }`}>
                {link.label}
              </span>
            </a>
          );
        })}
      </div>
    </>
  );
};
