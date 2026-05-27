import React from 'react';
import { Navbar } from '@/components/builder/Navbar';
import { Hero } from '@/components/builder/Hero';
import { IconRow } from '@/components/builder/IconRow';
import { Values } from '@/components/builder/Values';
import { ServiceList } from '@/components/builder/ServiceList';
import { Footer } from '@/components/builder/Footer';
import { getSiteById } from '@/actions/sites';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function PublicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const components = site.pages_json?.index || [];

  return (
    <main className="min-h-screen">
      {components.map((comp: any) => (
        <div key={comp.id}>
          {comp.type === 'navbar' && <Navbar data={comp.data} siteId={site.id} />}
          {comp.type === 'hero' && <Hero data={comp.data} />}
          {comp.type === 'iconrow' && <IconRow data={comp.data} />}
          {comp.type === 'values' && <Values data={comp.data} />}
          {comp.type === 'servicelist' && <ServiceList data={comp.data} />}
          {comp.type === 'footer' && <Footer data={comp.data} siteId={site.id} />}
        </div>
      ))}
    </main>
  );
}
