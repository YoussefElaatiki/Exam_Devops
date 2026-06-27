import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

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

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('returns 400 for invalid email', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'not-an-email',
        username: 'testuser',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation error');
    });

    it('returns 400 for short password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        username: 'testuser',
        password: '123',
      });

      expect(res.status).toBe(400);
    });

    it('returns 400 for missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({});
      expect(res.status).toBe(400);
    });

    it('registers a new user successfully', async () => {
      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'new@example.com',
        username: 'newuser',
        role: 'USER',
        createdAt: new Date().toISOString(),
      });

      const res = await request(app).post('/api/auth/register').send({
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe('new@example.com');
    });

    it('returns 409 if user already exists', async () => {
      prismaMock.user.findFirst.mockResolvedValue({
        id: 'user-1',
        email: 'existing@example.com',
        username: 'existing',
      });

      const res = await request(app).post('/api/auth/register').send({
        email: 'existing@example.com',
        username: 'existing',
        password: 'password123',
      });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    it('returns 400 for missing email', async () => {
      const res = await request(app).post('/api/auth/login').send({
        password: 'password123',
      });

      expect(res.status).toBe(400);
    });

    it('returns 401 for wrong credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const res = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /health', () => {
    it('returns health status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });
});
