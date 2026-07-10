require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Add column if it doesn't exist
  const sql = `ALTER TABLE \"User\" ADD COLUMN IF NOT EXISTS \"isActive\" boolean DEFAULT true;`;
  await prisma.$executeRawUnsafe(sql);
  console.log('Ensured isActive column exists on User');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
