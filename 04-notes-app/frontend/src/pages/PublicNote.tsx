import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ArrowLeft, Calendar, User } from 'lucide-react';
import api from '../api/client';
import MarkdownPreview from '../components/MarkdownPreview';

interface PublicNoteData {
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: { username: string };
}

export default function PublicNote() {
  const { slug } = useParams<{ slug: string }>();
  const [note, setNote] = useState<PublicNoteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api
      .get<PublicNoteData>(`/notes/public/${slug}`)
      .then((res) => setNote(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-300 mb-4">404</h1>
          <p className="text-gray-500 mb-6">Note not found or no longer public.</p>
          <Link to="/" className="text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center text-blue-600 hover:underline text-sm">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
          <Link to="/" className="flex items-center space-x-2 text-gray-600">
            <FileText className="h-5 w-5 text-blue-600" />
            <span className="font-semibold">Markdown Notes</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{note.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {note.author.username}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>

          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6">
              {note.tags.map((tag) => (
                <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="border-t border-gray-100 pt-6">
            <MarkdownPreview content={note.content} />
          </div>
        </div>
      </main>
    </div>
  );
}
