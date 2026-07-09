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
  if (!body.userId) {
    throw new Error("userId is required");
  }

  if (!body.tableId && body.tableNumber == null) {
    throw new Error("tableId or tableNumber is required");
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    throw new Error("items must be a non-empty array");
  }

  const user = await prisma.user.findUnique({
    where: { id: body.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  let table = null;

  if (body.tableId) {
    table = await prisma.cafeTable.findUnique({
      where: { id: body.tableId },
    });
  }

  if (!table && body.tableNumber != null) {
    table = await prisma.cafeTable.findUnique({
      where: { tableNumber: Number(body.tableNumber) },
    });
  }

  if (!table) {
    throw new Error("Table not found");
  }

  const tableId = table.id;

  let total = 0;
  const items: Array<{ productId: string; quantity: number; price: number }> = [];

  for (const item of body.items) {
    if (!item.productId) {
      throw new Error("Each item must include productId");
    }

    const quantity = Number(item.quantity ?? 1);

    if (Number.isNaN(quantity) || quantity <= 0) {
      throw new Error("Each item quantity must be a positive number");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: item.productId,
      },
    });

    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    const price = Number(product.price);
    total += price * quantity;

    items.push({
      productId: product.id,
      quantity,
      price,
    });
  }

  return prisma.order.create({
    data: {
      orderNumber: `SC-${Date.now()}`,
      userId: body.userId,
      tableId,
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
