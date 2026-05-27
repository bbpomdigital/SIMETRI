'use client';

import React from 'react';
import { ExternalLink, Image } from 'lucide-react';

interface HeroProps {
  data: {
    title?: string;
    subtitle?: string;
    description?: string;
    badge?: string;
    backgroundImage?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
  isEditor?: boolean;
  onEditField?: (field: string, value: string, label: string) => void;
}

export const Hero = ({ data, isEditor, onEditField }: HeroProps) => {
  const editableClass = isEditor ? "cursor-pointer hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5 rounded-xl transition-all p-2 -m-2" : "";

  return (
    <section className="relative min-h-[380px] md:min-h-[85vh] flex items-start md:items-center justify-center px-4 pt-20 pb-20 md:py-24 overflow-hidden bg-[#0f172a]">
      {/* Background Image with Optimized Dark Overlay for maximum contrast */}
      <div 
        onClick={(e) => {
          if (isEditor) {
            e.stopPropagation();
            onEditField?.('backgroundImage', data.backgroundImage || '/bbpom-samarinda.jpg', 'Gambar Sampul Header');
          }
        }}
        className={`absolute inset-0 z-0 ${isEditor ? 'cursor-pointer hover:brightness-[0.85] transition-all group/bg' : ''}`}
        title={isEditor ? "Klik di sini untuk mengganti gambar latar belakang" : ""}
      >
        <img 
          src={data.backgroundImage || "/bbpom-samarinda.jpg"} 
          className="w-full h-full object-cover"
          alt="Background"
        />
        {/* Dark Vignette Overlay: Makes text pop beautifully while keeping the background image 100% visible */}
        <div className="absolute inset-0 bg-[#0f172a]/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/50 via-transparent to-[#0f172a]"></div>
        
        {isEditor && (
          <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/bg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="px-5 py-3 bg-slate-900/90 text-white text-xs font-black uppercase tracking-wider rounded-2xl border border-white/20 shadow-2xl flex items-center gap-2 backdrop-blur-md">
              <Image size={14} className="text-blue-400" />
              Klik Latar Belakang Untuk Mengubah Gambar Sampul
            </span>
          </div>
        )}
      </div>

      {/* Customizable Background Button for Editor - Optimized position & scale for mobile */}
      {isEditor && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditField?.('backgroundImage', data.backgroundImage || '/bbpom-samarinda.jpg', 'Gambar Sampul Header');
          }}
          className="absolute top-4 right-4 z-30 px-3 py-2 bg-slate-900/90 hover:bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border border-white/20 hover:border-white/30 active:scale-95 flex items-center gap-1.5 backdrop-blur-md shadow-2xl hover:scale-105"
          title="Ubah Gambar Sampul Latar Belakang"
        >
          <Image size={12} className="text-blue-400 animate-pulse" />
          Ubah Latar Belakang
        </button>
      )}

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center space-y-4 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        
        {/* Badge element */}
        {data.badge && (
          <div className="flex justify-center">
            <span 
              onClick={(e) => {
                if (isEditor) {
                  e.stopPropagation();
                  onEditField?.('badge', data.badge || '', 'Teks Badge');
                }
              }}
              className={`inline-flex items-center gap-2 px-3 py-0.5 md:px-4 md:py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[9px] md:text-[10px] font-black rounded-full tracking-[2px] uppercase ${editableClass}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              {data.badge}
            </span>
          </div>
        )}
        
        {/* Main Title & Slogan Section */}
        <div className="space-y-2 md:space-y-3 w-full">
          <h1 
            onClick={(e) => {
              if (isEditor) {
                e.stopPropagation();
                onEditField?.('title', data.title || '', 'Judul Utama');
              }
            }}
            className={`text-2xl md:text-6xl lg:text-7.5xl font-black text-white tracking-tight leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] ${editableClass}`}
          >
            {(data.title && data.title.toUpperCase() === 'GRAFITI') ? 'SIMETRI' : (data.title || 'SIMETRI')}
          </h1>
          <h2 
            onClick={(e) => {
              if (isEditor) {
                e.stopPropagation();
                onEditField?.('subtitle', data.subtitle || '', 'Slogan / Sub Judul');
              }
            }}
            className={`text-[10px] md:text-xl lg:text-2xl font-black text-blue-300 leading-relaxed tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${editableClass}`}
          >
            {(data.subtitle && data.subtitle.includes('GeRbang')) ? 'Sistem Manajemen Template Website Terintegrasi' : (data.subtitle || 'Sistem Manajemen Template Website Terintegrasi')}
          </h2>
        </div>

        {/* Description Text - Hidden on mobile to compress space verticality */}
        <p 
          onClick={(e) => {
            if (isEditor) {
              e.stopPropagation();
              onEditField?.('description', data.description || '', 'Deskripsi Panjang');
            }
          }}
          className={`hidden md:block text-xs md:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed font-bold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] ${editableClass}`}
        >
          {data.description || 'Dapatkan seluruh informasi tentang BBPOM di Samarinda dalam satu pintu yang aman dan terpercaya.'}
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-col items-center gap-4 w-full">
          {
            (() => {
              const hasButtonLink = data.buttonUrl && data.buttonUrl !== '#' && data.buttonUrl.trim() !== '';
              const buttonContent = (
                <div 
                  onClick={(e) => {
                    if (isEditor) {
                      e.stopPropagation();
                      onEditField?.('buttonText', data.buttonText || 'PELAJARI SELENGKAPNYA', 'Label Tombol');
                    }
                  }}
                  className={`px-6 py-3 md:px-8 md:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-[10px] md:text-xs tracking-widest hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_10px_25px_rgba(59,130,246,0.3)] active:scale-95 inline-block cursor-pointer ${editableClass}`}
                >
                  {data.buttonText || 'PELAJARI SELENGKAPNYA'}
                </div>
              );

              if (isEditor) return buttonContent;
              if (hasButtonLink) {
                return (
                  <a href={data.buttonUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                    {buttonContent}
                  </a>
                );
              }
              return buttonContent;
            })()
          }

          {isEditor && (
            <div className="flex flex-col items-center gap-2">
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditField?.('buttonUrl', data.buttonUrl || '#', 'Link Tujuan Tombol');
                }}
                className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-[9px] font-mono text-blue-300 uppercase tracking-wider cursor-pointer hover:bg-blue-500/30 hover:text-blue-200 transition-all flex items-center gap-2"
              >
                <ExternalLink size={10} />
                LINK: {data.buttonUrl || '#'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Curved Bottom Deco - Proportional height on mobile */}
      <div className="absolute bottom-0 left-0 right-0 h-10 md:h-16 bg-white rounded-t-[24px] md:rounded-t-[80px] z-10"></div>
    </section>
  );
};
