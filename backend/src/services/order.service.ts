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

export function getCafeTables() {
  return prisma.cafeTable.findMany({
    orderBy: { tableNumber: "asc" },
    select: {
      id: true,
      tableNumber: true,
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

export async function createMultipleOrders(body: any) {
  if (!body.userId) {
    throw new Error("userId is required");
  }

  if (!Array.isArray(body.orders) || body.orders.length === 0) {
    throw new Error("orders must be a non-empty array");
  }

  const user = await prisma.user.findUnique({ where: { id: body.userId } });

  if (!user) {
    throw new Error("User not found");
  }

  const createOps: any[] = [];

  for (let i = 0; i < body.orders.length; i++) {
    const ord = body.orders[i];

    if (ord.tableNumber == null) {
      throw new Error("Each order requires tableNumber");
    }

    if (!Array.isArray(ord.items) || ord.items.length === 0) {
      throw new Error("Each order must include a non-empty items array");
    }

    const tableNumber = Number(ord.tableNumber);
    if (Number.isNaN(tableNumber)) {
      throw new Error("Each order must specify a valid tableNumber");
    }

    const table = await prisma.cafeTable.findUnique({ where: { tableNumber } });

    if (!table) {
      throw new Error("Table not found for one of the orders");
    }

    const tableId = table.id;

    let total = 0;
    const items: Array<{ productId: string; quantity: number; price: number }> = [];

    for (const item of ord.items) {
      if (!item.productId) {
        throw new Error("Each item must include productId");
      }

      const quantity = Number(item.quantity ?? 1);

      if (Number.isNaN(quantity) || quantity <= 0) {
        throw new Error("Each item quantity must be a positive number");
      }

      const product = await prisma.product.findUnique({ where: { id: item.productId } });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const price = Number(product.price);
      total += price * quantity;

      items.push({ productId: product.id, quantity, price });
    }

    createOps.push(
      prisma.order.create({
        data: {
          orderNumber: `SC-${Date.now()}-${i}`,
          userId: body.userId,
          tableId,
          total,
          items: { create: items },
        },
        include: {
          user: true,
          table: true,
          items: { include: { product: true } },
        },
      })
    );
  }

  const results = await prisma.$transaction(createOps);

  return results;
}

export async function markOrderComplete(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { isCompleted: true },
    include: {
      user: true,
      table: true,
      items: { include: { product: true } },
    },
  });
}

export async function getIncome(period: "day" | "month" | "year") {
  const now = new Date();
  let start: Date;

  if (period === "day") {
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "month") {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    start = new Date(now.getFullYear(), 0, 1);
  }

  const agg = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      createdAt: { gte: start },
      isCompleted: true,
    },
  });

  const total = agg._sum.total ? Number(agg._sum.total) : 0;

  return { period, total };
}
