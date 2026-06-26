import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import NoteCard from '../components/NoteCard';
import NoteEditor from '../components/NoteEditor';
import SearchBar from '../components/SearchBar';
import { useNotes } from '../hooks/useNotes';
import type { Note } from '../types';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [editingNote, setEditingNote] = useState<Partial<Note> | null>(null);

  const debouncedSearch = useDebounce(search, 400);
  const { notes, loading, error, createNote, updateNote, deleteNote } = useNotes(debouncedSearch);

  const handleSave = async (data: Partial<Note>) => {
    if (editingNote?.id) {
      await updateNote(editingNote.id, data);
    } else {
      await createNote(data);
    }
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
  };

  const handleNew = () => {
    setEditingNote({});
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this note?')) {
      await deleteNote(id);
      if (editingNote?.id === id) {
        setEditingNote(null);
      }
    }
  };

  if (editingNote !== null) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-4rem)]">
        <NoteEditor note={editingNote} onSave={handleSave} onCancel={() => setEditingNote(null)} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Notes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </button>
      </div>

      <div className="mb-6">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            {search ? 'No notes match your search.' : 'No notes yet. Create your first note!'}
          </p>
          {!search && (
            <button onClick={handleNew} className="mt-4 text-blue-600 hover:underline text-sm">
              + Create a note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note.id} onClick={() => handleEdit(note)} className="cursor-pointer">
              <NoteCard note={note} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
