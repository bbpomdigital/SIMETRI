'use client';

import React, { useState, useEffect } from 'react';

export const PageTransitionLoader = () => {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Fade out loader on page mount
    const timer = setTimeout(() => {
      setIsActive(false);
    }, 400);

    const handleLinkClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      
      // Traverse up to find anchor tag
      while (target && target.tagName !== 'A') {
        target = target.parentElement;
      }
      
      if (target && target.tagName === 'A') {
        const href = target.getAttribute('href');
        const isTargetBlank = target.getAttribute('target') === '_blank';
        
        if (href && !isTargetBlank) {
          const isInternal = 
            href.startsWith('/') || 
            href.startsWith('?') || 
            href.startsWith(window.location.origin);
            
          const isHash = href.startsWith('#');
          const isJavascript = href.startsWith('javascript:');
          
          if (isInternal && !isHash && !isJavascript) {
            e.preventDefault();
            setIsActive(true); // Trigger transition overlay fade-in
            
            // Navigate after overlay fade-in animation
            setTimeout(() => {
              window.location.href = href;
            }, 250);
          }
        }
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('click', handleLinkClick);
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center transition-all duration-300 ${
        isActive 
          ? 'opacity-100 scale-100 pointer-events-auto bg-[#f8fafc]/95 backdrop-blur-md' 
          : 'opacity-0 scale-105 pointer-events-none'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Soft glowing radial background flare */}
        <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Sleek Dual Ring Spinner */}
        <div className="relative w-14 h-14 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-blue-600 animate-spin"></div>
        </div>
        
        {/* Premium typography */}
        <h4 className="text-xs font-black uppercase tracking-[3px] text-slate-800 animate-pulse">
          Memuat Halaman
        </h4>
        <span className="text-[8px] font-black uppercase tracking-[1.5px] text-blue-600 mt-1.5">
          BBPOM Samarinda
        </span>
      </div>
    </div>
  );
};
