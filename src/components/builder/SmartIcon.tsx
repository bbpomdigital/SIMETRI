'use client';

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface SmartIconProps {
  name: string;
  className?: string;
  size?: number;
  fallback?: React.ComponentType<any>;
}

export default function SmartIcon({ name, className = '', size = 20, fallback: Fallback = LucideIcons.HelpCircle }: SmartIconProps) {
  if (!name) {
    return <Fallback size={size} className={className} />;
  }

  // 1. Deteksi jika itu URL Gambar
  const isImageUrl = name.startsWith('/') || name.startsWith('http');
  if (isImageUrl) {
    return (
      <img
        src={name}
        alt="icon"
        className={`object-cover rounded-md ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  // 2. Deteksi jika itu Google Material Icons (menggunakan awalan 'material:')
  if (name.startsWith('material:')) {
    const iconName = name.replace('material:', '').trim();
    return (
      <span
        className={`material-icons-outlined select-none inline-flex items-center justify-center ${className}`}
        style={{ fontSize: size, width: size, height: size, lineHeight: 1 }}
      >
        {iconName}
      </span>
    );
  }

  // 3. Fallback ke Lucide Icons
  // Cari di Lucide Icons secara dinamis
  const LucideComp = (LucideIcons as any)[name];
  if (LucideComp) {
    return <LucideComp size={size} className={className} />;
  }

  // Jika tidak ditemukan sama sekali, render teks default Google Material Icons sebagai alternatif langsung
  // Ini memberi user kebebasan mengetikkan nama ikon material murni secara langsung, misal "security"
  return (
    <span
      className={`material-icons-outlined select-none inline-flex items-center justify-center ${className}`}
      style={{ fontSize: size, width: size, height: size, lineHeight: 1 }}
    >
      {name}
    </span>
  );
}
