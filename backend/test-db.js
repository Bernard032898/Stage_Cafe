require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    await prisma.$connect();
    console.log("Database Connected Successfully");

    const products = await prisma.product.findMany();
    console.log(products);
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

test();