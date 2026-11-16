import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed(): Promise<void> {
  const password = process.env.SEED_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error('SEED_PASSWORD must be set to at least 12 characters.');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const seedUsers = [
    {
      name: 'Synthetic Platform Admin',
      email: 'admin@example.invalid',
      role: UserRole.ADMIN,
    },
    {
      name: 'Synthetic Claims Reviewer',
      email: 'reviewer@example.invalid',
      role: UserRole.REVIEWER,
    },
    {
      name: 'Synthetic Claimant',
      email: 'claimant@example.invalid',
      role: UserRole.CLAIMANT,
    },
  ];

  for (const user of seedUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, role: user.role, passwordHash },
      create: { ...user, passwordHash },
    });
  }
}

seed()
  .catch((error: unknown) => {
    console.error('Prisma seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
