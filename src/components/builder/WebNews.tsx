'use client';

import React, { useState, useEffect } from 'react';
import { getWebsiteNews } from '@/actions/news';
import { Globe, RefreshCw, Calendar, ArrowUpRight, Newspaper } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  image: string;
  description: string;
  source: 'website' | 'facebook';
}

interface WebNewsProps {
  data: {
    sectionTitle?: string;
    sectionSubtitle?: string;
  };
  isEditor?: boolean;
  onEditField?: (field: string, value: string, label: string) => void;
}

export const WebNews = ({ data, isEditor, onEditField }: WebNewsProps) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await getWebsiteNews();
      setNews(res);
      setSelectedItemIndex(0);
    } catch (e) {
      console.error('Gagal mengambil data berita web:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const editableClass = isEditor ? "cursor-pointer hover:ring-2 hover:ring-blue-500/50 hover:bg-blue-500/5 rounded-lg transition-all px-2 -mx-2" : "";
  const featuredItem = news[selectedItemIndex] || news[0] || null;
  const listItems = news.slice(0, 4); // Display up to 4 items on the right side for absolute compactness

  return (
    <section className="py-12 px-6 bg-[#f8fafc] text-slate-800 relative border-b border-slate-100">
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        {((data.sectionTitle !== '' || data.sectionSubtitle !== '') || isEditor) && (
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 border-b border-slate-200/60 pb-6 gap-4">
            <div>
              {(data.sectionSubtitle !== '' || isEditor) && (
                <span 
                  onClick={() => isEditor && onEditField?.('sectionSubtitle', data.sectionSubtitle !== undefined ? data.sectionSubtitle : 'BBPOM di Samarinda', 'Sub-judul Seksi')}
                  className={`block text-[10px] font-black text-blue-600 uppercase tracking-[2px] mb-1.5 ${editableClass} ${
                    isEditor && data.sectionSubtitle === '' ? 'text-slate-300/60 border border-dashed border-slate-200/50 px-2 py-0.5 rounded normal-case font-normal inline-block' : ''
                  }`}
                >
                  {isEditor && data.sectionSubtitle === '' ? '[Sub-judul Seksi Kosong]' : (data.sectionSubtitle !== undefined ? data.sectionSubtitle : 'BBPOM di Samarinda')}
                </span>
              )}
              {(data.sectionTitle !== '' || isEditor) && (
                <h2 
                  onClick={() => isEditor && onEditField?.('sectionTitle', data.sectionTitle !== undefined ? data.sectionTitle : 'Berita & Update Terkini', 'Judul Seksi')}
                  className={`text-2xl font-black tracking-tight text-slate-900 ${editableClass} ${
                    isEditor && data.sectionTitle === '' ? 'text-slate-300 italic border border-dashed border-slate-200/50 px-3 py-1 rounded inline-block text-sm font-normal' : ''
                  }`}
                >
                  {isEditor && data.sectionTitle === '' ? '[Judul Seksi Kosong]' : (data.sectionTitle !== undefined ? data.sectionTitle : 'Berita & Update Terkini')}
                </h2>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200/80 rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-[0.5px] self-start sm:self-auto shadow-sm">
              <Globe size={11} className="text-blue-500" />
              Website Berita
            </div>
          </div>
        )}

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[380px] bg-slate-200/40 rounded-[20px] border border-slate-200/60 animate-pulse p-6 flex flex-col justify-end">
              <div className="w-20 h-5 bg-slate-200 rounded mb-3"></div>
              <div className="w-full h-6 bg-slate-200 rounded mb-2"></div>
              <div className="w-2/3 h-6 bg-slate-200 rounded"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map(n => (
                <div key={n} className="flex gap-3 p-3 bg-white border border-slate-200/60 rounded-xl animate-pulse">
                  <div className="w-16 h-16 bg-slate-200 rounded-lg shrink-0"></div>
                  <div className="flex-1 py-1 space-y-2">
                    <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-white border border-slate-200/60 rounded-[24px] p-10 text-center shadow-sm">
            <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <Newspaper size={20} />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">Gagal Memuat Berita</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto mb-6">
              Terjadi masalah saat mengambil RSS feed berita website. Silakan coba beberapa saat lagi.
            </p>
            <button 
              onClick={fetchNews}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 mx-auto shadow-md transition-all"
            >
              <RefreshCw size={12} />
              Coba Lagi
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && news.length === 0 && (
          <div className="bg-white border border-slate-200/60 rounded-[24px] p-10 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
              <Newspaper size={20} />
            </div>
            <h3 className="text-base font-black text-slate-900 mb-1">Belum Ada Berita</h3>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              Tidak ada data berita yang ditemukan dalam RSS Feed website saat ini.
            </p>
          </div>
        )}

        {/* Main Feed Content */}
        {!loading && !error && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Left featured large card */}
            {featuredItem && (
              <div className="flex flex-col justify-between relative group rounded-[24px] overflow-hidden border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300 min-h-[380px]">
                {/* Image top half container */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100 border-b border-slate-100 shrink-0">
                  {featuredItem.image ? (
                    <img 
                      src={featuredItem.image} 
                      alt={featuredItem.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                      <Newspaper size={44} />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-blue-600 text-white text-[8px] font-black uppercase tracking-[1.5px] rounded-md shadow-md">
                    Berita Terkini
                  </span>
                </div>

                {/* Text bottom half container */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase mb-2">
                      <Calendar size={10} />
                      {featuredItem.pubDate}
                    </span>
                    <h3 className="text-base font-black text-slate-900 leading-snug tracking-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {featuredItem.title}
                    </h3>
                    <p className="text-slate-500 text-xs font-normal leading-relaxed line-clamp-2 mb-4">
                      {featuredItem.description || 'Tidak ada ringkasan deskripsi. Silakan klik tombol di bawah untuk membaca berita selengkapnya.'}
                    </p>
                  </div>
                  
                  <a 
                    href={featuredItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 hover:bg-blue-600 hover:text-white px-5 py-3 rounded-xl transition-all duration-300 w-full"
                  >
                    Selengkapnya
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            )}

            {/* Right news items list */}
            <div className="flex flex-col gap-3 justify-start">
              {listItems.map((item, idx) => {
                const isActive = idx === selectedItemIndex;
                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedItemIndex(idx)}
                    className={`flex items-center gap-3 p-3 rounded-[18px] border transition-all duration-300 cursor-pointer group/item ${
                      isActive 
                        ? 'bg-blue-50 border-blue-400 shadow-sm' 
                        : 'bg-white border-slate-200/60 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {/* Small thumbnail square image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-50 border border-slate-100 relative">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                          <Newspaper size={16} />
                        </div>
                      )}
                    </div>

                    {/* Title and date text */}
                    <div className="flex-1 min-w-0">
                      <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar size={8} />
                        {item.pubDate}
                      </span>
                      <h4 className={`text-xs font-black leading-snug line-clamp-2 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-700 group-hover/item:text-blue-600'
                      }`}>
                        {item.title}
                      </h4>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
