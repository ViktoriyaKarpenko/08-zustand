import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';

export const metadata: Metadata = {
  title: 'Create Note — NoteHub',
  description: 'Create a new personal note with a title, content, and tag.',
  openGraph: {
    title: 'Create Note — NoteHub',
    description: 'Create a new personal note with a title, content, and tag.',
    url: 'https://08-zustand-phi-rust.vercel.app/notes/action/create',
    images: [
      {
        url: 'https://notehub.app/og-image.png',
      },
    ],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
