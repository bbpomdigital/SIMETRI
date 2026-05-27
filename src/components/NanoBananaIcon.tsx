import React from 'react';

interface NanoBananaIconProps {
  size?: number;
  className?: string;
}

export default function NanoBananaIcon({ size = 24, className = "" }: NanoBananaIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradien Emas Pisang Premium */}
        <linearGradient id="bananaGrad" x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor="#FFE53B" />
          <stop offset="50%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>

        {/* Gradien Kilau Cahaya Nano */}
        <linearGradient id="nanoGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0369A1" stopOpacity="0.2" />
        </linearGradient>

        {/* Drop shadow premium */}
        <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Lingkaran Orbit Teknologi Latar Belakang */}
      <circle
        cx="50"
        cy="50"
        r="42"
        stroke="url(#nanoGlow)"
        strokeWidth="1.5"
        strokeDasharray="4 8"
        className="animate-spin"
        style={{ transformOrigin: 'center', animationDuration: '20s' }}
      />
      
      <circle
        cx="50"
        cy="50"
        r="35"
        stroke="#FFB300"
        strokeWidth="0.75"
        strokeOpacity="0.2"
      />

      {/* Orbit Cincin dengan Sudut Kemiringan */}
      <ellipse
        cx="50"
        cy="52"
        rx="25"
        ry="8"
        stroke="#38BDF8"
        strokeWidth="1.2"
        strokeOpacity="0.6"
        transform="rotate(-25 50 52)"
      />

      {/* Node Partikel Nano (Titik-Titik Penghubung Teknologi) */}
      <circle cx="28" cy="40" r="2.5" fill="#38BDF8" filter="url(#glowFilter)" />
      <line x1="28" y1="40" x2="38" y2="48" stroke="#38BDF8" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="68" cy="62" r="2" fill="#FFE53B" />
      <circle cx="74" cy="46" r="2.5" fill="#38BDF8" filter="url(#glowFilter)" />

      {/* BENTUK UTAMA: PISANG NANO PREMIUM */}
      {/* Melengkung indah dengan lekukan geometris modern */}
      <path
        d="M 32 30 
           C 42 22, 65 24, 76 46 
           C 80 54, 78 68, 62 76 
           C 48 83, 34 78, 26 66 
           C 22 60, 24 50, 32 46
           C 42 42, 54 48, 62 56
           C 68 62, 66 70, 56 72
           C 46 74, 38 68, 38 60
           C 38 52, 46 44, 52 46
           C 42 38, 32 44, 32 30 Z"
        fill="url(#bananaGrad)"
        filter="url(#glowFilter)"
      />

      {/* Aksen Kulit Pangkal Pisang (Ujung Atas) */}
      <path
        d="M 32 30 C 31 28, 29 28, 28 30 C 27 32, 29 34, 32 30 Z"
        fill="#5D4037"
      />

      {/* Aksen Ujung Bawah Pisang */}
      <path
        d="M 62 76 C 63 78, 65 79, 66 77 C 67 75, 65 74, 62 76 Z"
        fill="#3E2723"
      />

      {/* Micro-chip Nano Pattern pada Pisang */}
      <path
        d="M 45 35 Q 52 38 58 46"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      
      <circle cx="58" cy="46" r="1.5" fill="#ffffff" />
    </svg>
  );
}
