require('dotenv').config();

const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminRole = await prisma.role.findUnique({ where: { name: 'Admin' } });

  if (!adminRole) {
    throw new Error('Admin role not found. Run prisma seed first.');
  }

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'AdminPass123';

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      firstName: 'Admin',
      lastName: 'User',
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email,
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log('Admin user upserted:', { email: user.email, id: user.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
