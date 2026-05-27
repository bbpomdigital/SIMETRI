import { getSiteById } from '@/actions/sites';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { Navbar } from '@/components/builder/Navbar';
import { Hero } from '@/components/builder/Hero';
import { IconRow } from '@/components/builder/IconRow';
import { Values } from '@/components/builder/Values';
import { ServiceList } from '@/components/builder/ServiceList';
import { Footer } from '@/components/builder/Footer';
import { FloatingElements } from '@/components/builder/FloatingElements';
import { WebNews } from '@/components/builder/WebNews';
import { FbNews } from '@/components/builder/FbNews';
import { Shield } from 'lucide-react';

export default async function ViewPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ p?: string }>
}) {
  const { id } = await params;
  const { p } = await searchParams;
  const site = await getSiteById(id);

  if (!site) {
    return notFound();
  }

  // Check if published or admin
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('auth_token');

  if (site.status !== 'published' && !isAdmin) {
    return notFound();
  }

  const pageSlug = (p || 'index').toLowerCase();
  const actualKey = Object.keys(site.pages_json || {}).find(k => k.toLowerCase() === pageSlug);
  const components = actualKey ? site.pages_json[actualKey] : (pageSlug === 'index' ? [] : notFound());

  // Load global Navbar and Footer from the index page for layout consistency (case-insensitive lookup)
  const indexKey = Object.keys(site.pages_json || {}).find(k => k.toLowerCase() === 'index') || 'index';
  const indexComponents = site.pages_json[indexKey] || [];
  const globalNavbar = indexComponents.find((c: any) => c.type === 'navbar');
  const globalFooter = indexComponents.find((c: any) => c.type === 'footer');

  return (
    <main className="min-h-screen bg-white relative">
      {/* Draft Mode Indicator for Admin */}
      {site.status !== 'published' && isAdmin && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] px-6 py-2 bg-amber-500 text-white rounded-full font-black text-[10px] uppercase tracking-[2px] shadow-2xl flex items-center gap-2 border-2 border-white">
          <Shield size={14} />
          Draft Mode View (Admin Only)
        </div>
      )}

      {/* Render Global Navbar */}
      {globalNavbar && <Navbar data={globalNavbar.data} siteId={site.id} />}

      {/* Render page-specific content in the middle, skipping duplicate navbars/footers if present */}
      {components
        .filter((comp: any) => comp.type !== 'navbar' && comp.type !== 'footer')
        .map((comp: any) => (
          <div key={comp.id}>
            {comp.type === 'hero' && <Hero data={comp.data} />}
            {comp.type === 'iconrow' && <IconRow data={comp.data} />}
            {comp.type === 'values' && <Values data={comp.data} />}
            {comp.type === 'servicelist' && <ServiceList data={comp.data} />}
            {comp.type === 'webnews' && <WebNews data={comp.data} />}
            {comp.type === 'fbnews' && <FbNews data={comp.data} />}
          </div>
        ))
      }

      {/* Render Global Footer */}
      {globalFooter && <Footer data={globalFooter.data} siteId={site.id} />}

      {/* Render Global Mobile Bottom Navigation Bar */}
      <FloatingElements links={globalNavbar?.data?.links || []} siteId={site.id} />
    </main>
  );
}
