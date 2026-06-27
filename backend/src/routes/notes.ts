import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { createNoteSchema, updateNoteSchema } from '../schemas/notes.schema';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { search, tags } = req.query;
    const userId = req.user!.id;

    const where: Record<string, unknown> = { authorId: userId };

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { content: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (tags) {
      const tagList = (tags as string).split(',').map((t) => t.trim()).filter(Boolean);
      where.tags = { hasSome: tagList };
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        isPublic: true,
        publicSlug: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, username: true } },
      },
    });

    res.json(notes);
  } catch (error) {
    next(error);
  }
});

router.get('/public/:slug', async (req, res: Response, next: NextFunction) => {
  try {
    const note = await prisma.note.findFirst({
      where: { publicSlug: req.params.slug, isPublic: true },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { username: true } },
      },
    });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await prisma.note.findFirst({
      where: { id: req.params.id, authorId: req.user!.id },
    });

    if (!note) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = createNoteSchema.parse(req.body);
    const publicSlug = data.isPublic ? nanoid(10) : null;

    const note = await prisma.note.create({
      data: {
        ...data,
        publicSlug,
        authorId: req.user!.id,
      },
    });

    res.status(201).json(note);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const data = updateNoteSchema.parse(req.body);
    const existing = await prisma.note.findFirst({
      where: { id: req.params.id, authorId: req.user!.id },
    });

    if (!existing) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    let publicSlug = existing.publicSlug;
    if (data.isPublic === true && !existing.publicSlug) {
      publicSlug = nanoid(10);
    } else if (data.isPublic === false) {
      publicSlug = null;
    }

    const note = await prisma.note.update({
      where: { id: req.params.id },
      data: { ...data, publicSlug },
    });

    res.json(note);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.note.findFirst({
      where: { id: req.params.id, authorId: req.user!.id },
    });

    if (!existing) {
      res.status(404).json({ error: 'Note not found' });
      return;
    }

    await prisma.note.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as notesRouter };
