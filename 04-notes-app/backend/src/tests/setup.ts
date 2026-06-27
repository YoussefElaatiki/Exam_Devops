import { beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';

process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  process.env.DATABASE_URL ||
  '******localhost:5432/testdb';
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.NODE_ENV = 'test';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

beforeAll(async () => {
  try {
    await prisma.$connect();
  } catch {
    // Database is optional for mocked unit tests.
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});
