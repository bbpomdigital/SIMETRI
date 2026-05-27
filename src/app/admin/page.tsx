import React from 'react';
import { Bell, Settings, Zap, Globe } from 'lucide-react';
import { getAllSites } from '@/actions/sites';
import CreateSiteButton from '@/components/CreateSiteButton';
import AdminSidebar from '@/components/AdminSidebar';
import SiteGridClient from './SiteGridClient';
import AdminDashboardMain from '@/app/admin/AdminDashboardMain';

export default async function AdminDashboard() {
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
      <AdminDashboardMain
        sites={sites}
        publishedCount={publishedCount}
        draftCount={draftCount}
      />
    </div>
  );
}
