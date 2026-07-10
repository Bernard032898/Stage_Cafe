import "dotenv/config";
import bcrypt from "bcrypt";
import app from "./app";
import { prisma } from "./prisma";

const PORT = process.env.PORT || 3000;

async function ensureSeedData() {
  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    return;
  }

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  const category = await prisma.category.upsert({
    where: { name: "Coffee" },
    update: {},
    create: { name: "Coffee" },
  });

  await prisma.product.create({
    data: {
      name: "Latte",
      price: 5.5,
      categoryId: category.id,
    },
  });

  await prisma.cafeTable.upsert({
    where: { tableNumber: 1 },
    update: {},
    create: { tableNumber: 1 },
  });

  const passwordHash = await bcrypt.hash("admin123", 10);

  await prisma.user.create({
    data: {
      firstName: "Admin",
      lastName: "User",
      email: "admin@stagecafe.com",
      passwordHash,
      roleId: adminRole.id,
    },
  });
}

async function startServer() {
  await prisma.$connect();
  await ensureSeedData();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});