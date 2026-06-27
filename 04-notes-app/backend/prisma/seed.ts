import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@notes.app' },
    update: {},
    create: {
      email: 'admin@notes.app',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@notes.app' },
    update: {},
    create: {
      email: 'user@notes.app',
      username: 'johndoe',
      password: userPassword,
      role: 'USER',
    },
  });

  const notes = [
    {
      title: 'Getting Started with Markdown',
      content: `# Welcome to Markdown Notes!\n\nThis is your first note. Markdown is a lightweight markup language.\n\n## Features\n\n- **Bold text**\n- *Italic text*\n- \`inline code\`\n\n\`\`\`javascript\nconsole.log('Hello, World!');\n\`\`\`\n\n> This is a blockquote\n\n## Lists\n\n1. First item\n2. Second item\n3. Third item`,
      tags: ['markdown', 'tutorial', 'getting-started'],
      isPublic: true,
      publicSlug: 'getting-started-markdown',
      authorId: user.id,
    },
    {
      title: 'Docker Cheatsheet',
      content: `# Docker Commands Cheatsheet\n\n## Basic Commands\n\n\`\`\`bash\n# Build image\ndocker build -t myapp .\n\n# Run container\ndocker run -p 3000:3000 myapp\n\n# List containers\ndocker ps\n\n# Stop container\ndocker stop <container_id>\n\`\`\`\n\n## Docker Compose\n\n\`\`\`bash\ndocker compose up --build\ndocker compose down\ndocker compose logs -f\n\`\`\``,
      tags: ['docker', 'devops', 'cheatsheet'],
      isPublic: true,
      publicSlug: 'docker-cheatsheet',
      authorId: admin.id,
    },
    {
      title: 'TypeScript Best Practices',
      content: `# TypeScript Best Practices\n\n## Use Strict Mode\n\nAlways enable strict mode in tsconfig.json:\n\n\`\`\`json\n{\n  "compilerOptions": {\n    "strict": true\n  }\n}\n\`\`\`\n\n## Type Inference\n\nLet TypeScript infer types when possible:\n\n\`\`\`typescript\n// Good\nconst message = 'Hello World';\n\n// Unnecessary\nconst message: string = 'Hello World';\n\`\`\``,
      tags: ['typescript', 'best-practices', 'programming'],
      isPublic: false,
      authorId: user.id,
    },
  ];

  for (const note of notes) {
    await prisma.note.upsert({
      where: { publicSlug: note.publicSlug ?? `private-${note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` },
      update: {},
      create: note,
    }).catch(async () => {
      await prisma.note.create({ data: note });
    });
  }

  console.log('✅ Seed complete!');
  console.log('👤 Admin: admin@notes.app / admin123');
  console.log('👤 User: user@notes.app / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
