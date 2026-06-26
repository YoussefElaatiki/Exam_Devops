import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Globe, Lock, Trash2, Edit, Share2 } from 'lucide-react';
import type { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const preview = note.content.replace(/[#*`_~\[\]]/g, '').substring(0, 120);

  const copyPublicLink = async () => {
    if (!note.publicSlug) {
      return;
    }
    const url = `${window.location.origin}/public/${note.publicSlug}`;
    await navigator.clipboard.writeText(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <Link
          to={`/notes/${note.id}`}
          className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1"
          onClick={(e) => e.stopPropagation()}
        >
          {note.title}
        </Link>
        <div className="flex items-center space-x-2 ml-2 shrink-0" title={note.isPublic ? 'Public' : 'Private'}>
          {note.isPublic ? (
            <Globe className="h-4 w-4 text-green-500" />
          ) : (
            <Lock className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{preview}...</p>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {note.tags.map((tag) => (
            <span key={tag} className="flex items-center bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {new Date(note.updatedAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
        <div className="flex items-center space-x-2">
          {note.isPublic && note.publicSlug && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                void copyPublicLink();
              }}
              title="Copy public link"
              className="text-gray-400 hover:text-blue-600 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
          <Link
            to={`/notes/${note.id}`}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
