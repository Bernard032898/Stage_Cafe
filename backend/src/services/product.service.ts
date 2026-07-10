import { prisma } from "../prisma";

export function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export function getCategories() {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function createProduct(data: any) {
  const { categoryName, categoryId, stock, ...rest } = data;

  let resolvedCategoryId = categoryId;

  if (!resolvedCategoryId && categoryName) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    resolvedCategoryId = category.id;
  }

  if (!resolvedCategoryId) {
    throw new Error("Category is required");
  }

  const parsedStock = Number(stock ?? 0);
  if (Number.isNaN(parsedStock) || parsedStock < 0) {
    throw new Error("Stock must be a non-negative number");
  }

  return prisma.product.create({
    data: {
      ...rest,
      price: Number(rest.price),
      stock: parsedStock,
      categoryId: resolvedCategoryId,
    },
    include: {
      category: true,
    },
  });
}