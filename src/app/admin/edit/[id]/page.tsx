import { getSiteByIdForEditor } from '@/actions/sites';
import EditorClient from '@/app/admin/edit/[id]/EditorClient';
import { notFound } from 'next/navigation';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const site = await getSiteByIdForEditor(id);

  if (!site) {
    return notFound();
  }

  return <EditorClient params={{ id }} initialData={site} />;
}
