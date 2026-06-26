import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';

const prismaMock = vi.hoisted(() => ({
  user: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  note: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  $connect: vi.fn(),
  $disconnect: vi.fn(),
}));

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => prismaMock),
}));

import { app } from '../app';

const JWT_SECRET = 'test-jwt-secret-key';
process.env.JWT_SECRET = JWT_SECRET;

function getAuthToken(userId = 'user-1', role = 'USER') {
  return jwt.sign({ id: userId, email: 'test@example.com', role }, JWT_SECRET, { expiresIn: '1h' });
}

const sampleNote = {
  id: 'note-1',
  title: 'Test Note',
  content: '# Test\n\nSome **markdown** content.',
  tags: ['test', 'example'],
  isPublic: false,
  publicSlug: null,
  authorId: 'user-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('Notes Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/notes', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).get('/api/notes');
      expect(res.status).toBe(401);
    });

    it('returns notes for authenticated user', async () => {
      prismaMock.note.findMany.mockResolvedValue([sampleNote]);

      const token = getAuthToken();
      const res = await request(app)
        .get('/api/notes')
        .set('Authorization', 'Bearer ' + token);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].title).toBe('Test Note');
    });
  });

  describe('POST /api/notes', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).post('/api/notes').send({
        title: 'New Note',
        content: 'Content',
      });

      expect(res.status).toBe(401);
    });

    it('returns 400 for missing title', async () => {
      const token = getAuthToken();
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', 'Bearer ' + token)
        .send({ content: 'Content only' });

      expect(res.status).toBe(400);
    });

    it('creates a note successfully', async () => {
      prismaMock.note.create.mockResolvedValue(sampleNote);

      const token = getAuthToken();
      const res = await request(app)
        .post('/api/notes')
        .set('Authorization', 'Bearer ' + token)
        .send({ title: 'New Note', content: '# Hello', tags: ['test'] });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Test Note');
    });
  });

  describe('GET /api/notes/public/:slug', () => {
    it('returns public note without authentication', async () => {
      prismaMock.note.findFirst.mockResolvedValue({
        ...sampleNote,
        isPublic: true,
        publicSlug: 'test-slug',
        author: { username: 'testuser' },
      });

      const res = await request(app).get('/api/notes/public/test-slug');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Note');
    });

    it('returns 404 for non-existent slug', async () => {
      prismaMock.note.findFirst.mockResolvedValue(null);

      const res = await request(app).get('/api/notes/public/nonexistent');
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('returns 401 without token', async () => {
      const res = await request(app).delete('/api/notes/note-1');
      expect(res.status).toBe(401);
    });

    it('returns 404 if note not found', async () => {
      prismaMock.note.findFirst.mockResolvedValue(null);

      const token = getAuthToken();
      const res = await request(app)
        .delete('/api/notes/nonexistent')
        .set('Authorization', 'Bearer ' + token);

      expect(res.status).toBe(404);
    });
  });
});
