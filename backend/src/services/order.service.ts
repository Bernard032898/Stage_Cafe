import { prisma } from "../prisma";

export function getOrders() {
  return prisma.order.findMany({
    include: {
      user: true,
      table: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function createOrder(body: any) {
  let total = 0;

  const items: Array<{ productId: string; quantity: number; price: number }> = [];

  for (const item of body.items || []) {
    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const quantity = Number(item.quantity || 1);
    const itemTotal = Number(product.price) * quantity;

    total += itemTotal;

    items.push({
      productId: product.id,
      quantity,
      price: Number(product.price),
    });
  }

  return prisma.order.create({
    data: {
      orderNumber: `SC-${Date.now()}`,
      userId: body.userId,
      tableId: body.tableId,
      total,
      items: {
        create: items,
      },
    },
    include: {
      user: true,
      table: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}