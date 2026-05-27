import React from 'react';
import { getAllSites } from '@/actions/sites';
import AdminSidebar from '@/components/AdminSidebar';
import PengaturanPageClient from './PengaturanPageClient';

export default async function PengaturanPage() {
  const sites = await getAllSites();
  const publishedCount = sites.filter(s => s.status === 'published').length;
  const draftCount = sites.filter(s => s.status === 'draft').length;

  return (
    <div className="flex min-h-screen font-sans">
      <AdminSidebar
        sitesCount={sites.length}
        publishedCount={publishedCount}
        draftCount={draftCount}
      />
      <PengaturanPageClient />
    </div>
  );
}
