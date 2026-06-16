import axios from 'axios';
import type { Note, NoteTag } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface CreateNoteData {
  title: string;
  content?: string;
  tag: NoteTag;
}

interface RawNote {
  _id?: string;
  id?: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
}

function normalizeNote(raw: RawNote): Note {
  return {
    ...raw,
    id: raw._id ?? raw.id ?? '',
  };
}

export async function fetchNotes(
  params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search, tag } = params;
  const response = await api.get<{
    notes: RawNote[];
    totalPages: number;
    page: number;
    perPage: number;
  }>('/notes', {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag ? { tag } : {}),
    },
  });
  return {
    ...response.data,
    notes: response.data.notes.map(normalizeNote),
  };
}

export async function createNote(data: CreateNoteData): Promise<Note> {
  const response = await api.post<RawNote>('/notes', data);
  return normalizeNote(response.data);
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<RawNote>(`/notes/${id}`);
  return normalizeNote(response.data);
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<RawNote>(`/notes/${id}`);
  return normalizeNote(response.data);
}
