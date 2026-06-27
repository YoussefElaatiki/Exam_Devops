import React, { useState } from 'react';
import { X, Globe, Lock, Tag, Save } from 'lucide-react';
import MarkdownPreview from './MarkdownPreview';
import type { Note } from '../types';

interface NoteEditorProps {
  note?: Partial<Note>;
  onSave: (data: Partial<Note>) => Promise<void>;
  onCancel: () => void;
}

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isPublic, setIsPublic] = useState(note?.isPublic || false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'split'>('split');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSave({ title, content, tags, isPublic });
    } catch {
      setError('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center p-4 border-b border-gray-200 gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="flex-1 text-xl font-semibold focus:outline-none text-gray-800 placeholder-gray-400"
        />
        <button
          onClick={() => setIsPublic(!isPublic)}
          className={`flex items-center space-x-1 text-sm px-3 py-1.5 rounded-lg transition-colors ${
            isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          <span>{isPublic ? 'Public' : 'Private'}</span>
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-1 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? 'Saving...' : 'Save'}</span>
        </button>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 flex-wrap">
        <Tag className="h-4 w-4 text-gray-400" />
        {tags.map((tag) => (
          <span key={tag} className="flex items-center bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Add tag + Enter"
          className="text-xs text-gray-500 focus:outline-none placeholder-gray-400 min-w-0"
        />
      </div>

      <div className="flex border-b border-gray-200 px-4">
        {(['edit', 'split', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {(activeTab === 'edit' || activeTab === 'split') && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your markdown here..."
            className={`${activeTab === 'split' ? 'w-1/2 border-r border-gray-200' : 'w-full'} p-4 font-mono text-sm resize-none focus:outline-none h-full`}
          />
        )}
        {(activeTab === 'preview' || activeTab === 'split') && (
          <div className={activeTab === 'split' ? 'w-1/2 overflow-y-auto' : 'w-full overflow-y-auto'}>
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>

      {error && <div className="px-4 py-2 bg-red-50 text-red-600 text-sm border-t border-red-100">{error}</div>}
    </div>
  );
}
