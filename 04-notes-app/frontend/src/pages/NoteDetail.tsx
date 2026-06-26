import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import NoteEditor from '../components/NoteEditor';
import type { Note } from '../types';

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .get<Note>(`/notes/${id}`)
      .then((res) => setNote(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleSave = async (data: Partial<Note>) => {
    if (!id) return;
    const res = await api.put<Note>(`/notes/${id}`, data);
    setNote(res.data);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
      <NoteEditor note={note} onSave={handleSave} onCancel={() => navigate('/')} />
    </div>
  );
}
