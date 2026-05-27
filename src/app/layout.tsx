import type { Metadata } from "next";
import React from 'react';
import "./globals.css";
import { PageTransitionLoader } from "@/components/builder/PageTransitionLoader";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "SIMETRI PRO | Sistem Manajemen Template Website Terintegrasi",
  description: "Sistem Manajemen Template Website Terintegrasi (SIMETRI) BBPOM di Samarinda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <PageTransitionLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
