import type { Metadata } from 'next';
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug?.[0] ?? 'all';
  const isAll = currentTag === 'all';

  const title = isAll ? 'All Notes | NoteHub' : `${currentTag} Notes | NoteHub`;
  const description = isAll
    ? 'Browse all your personal notes in one place on NoteHub.'
    : `Browse your ${currentTag} notes on NoteHub. Stay organized and productive.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-phi-rust.vercel.app`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub — personal notes manager',
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const { slug } = await params;
  const currentTag = slug?.[0] ?? 'all';
  const activeTag = currentTag === 'all' ? undefined : currentTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', 1, '', activeTag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, tag: activeTag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient key={currentTag} tag={activeTag} />
    </HydrationBoundary>
  );
}
