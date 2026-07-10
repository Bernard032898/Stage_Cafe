require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  const cashierRole = await prisma.role.upsert({
    where: { name: "Cashier" },
    update: {},
    create: { name: "Cashier" },
  });

  const category = await prisma.category.upsert({
    where: { name: "Coffee" },
    update: {},
    create: { name: "Coffee" },
  });

  const product = await prisma.product.create({
    data: {
      name: "Latte",
      price: 5.5,
      categoryId: category.id,
    },
  });

  const table = await prisma.cafeTable.upsert({
    where: { tableNumber: 1 },
    update: {},
    create: { tableNumber: 1 },
  });

  console.log({ adminRole, cashierRole, category, product, table });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());