import { prisma } from "../prisma";

export function getProducts() {
  return prisma.product.findMany({
    include: {
      category: true
    }
  });
}

export async function createProduct(data: any) {
  const { categoryName, categoryId, ...rest } = data;

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

  return prisma.product.create({
    data: {
      ...rest,
      price: Number(rest.price),
      categoryId: resolvedCategoryId,
    },
    include: {
      category: true,
    },
  });
}