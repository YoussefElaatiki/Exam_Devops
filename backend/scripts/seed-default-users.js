const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDefaultUsers() {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@notes.app' },
    update: {},
    create: {
      email: 'admin@notes.app',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@notes.app' },
    update: {},
    create: {
      email: 'user@notes.app',
      username: 'johndoe',
      password: userPassword,
      role: 'USER',
    },
  });
}

seedDefaultUsers()
  .then(() => {
    console.log('Default users ensured (admin/user)');
  })
  .catch((error) => {
    console.error('Failed to seed default users:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });