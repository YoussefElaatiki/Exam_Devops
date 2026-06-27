import { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import type { Note } from '../types';

export function useNotes(search?: string, tags?: string) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (tags) params.set('tags', tags);
      const query = params.toString();
      const res = await api.get<Note[]>(query ? `/notes?${query}` : '/notes');
      setNotes(res.data);
    } catch {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, [search, tags]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (data: Partial<Note>) => {
    const res = await api.post<Note>('/notes', data);
    setNotes((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateNote = async (id: string, data: Partial<Note>) => {
    const res = await api.put<Note>(`/notes/${id}`, data);
    setNotes((prev) => prev.map((n) => (n.id === id ? res.data : n)));
    return res.data;
  };

  const deleteNote = async (id: string) => {
    await api.delete(`/notes/${id}`);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, loading, error, fetchNotes, createNote, updateNote, deleteNote };
}
