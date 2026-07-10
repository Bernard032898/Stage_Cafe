import { prisma } from "../prisma";

export function getAllTables() {
  return prisma.cafeTable.findMany({
    include: {
      orders: {
        where: { isCancelled: false },
      },
    },
    orderBy: { tableNumber: "asc" },
  });
}

export async function createTable() {
  // Auto-generate next table number
  const lastTable = await prisma.cafeTable.findFirst({
    orderBy: { tableNumber: "desc" },
  });

  const nextTableNumber = (lastTable?.tableNumber || 0) + 1;

  return prisma.cafeTable.create({
    data: { tableNumber: nextTableNumber },
  });
}

export async function deleteTable(id: string) {
  const table = await prisma.cafeTable.findUnique({
    where: { id },
    include: { orders: true },
  });

  if (!table) {
    throw new Error("Table not found");
  }

  if (table.orders && table.orders.length > 0) {
    throw new Error("Cannot delete table with existing orders");
  }

  return prisma.cafeTable.delete({
    where: { id },
  });
}

export async function updateTableStatus(id: string, isInUse: boolean) {
  const table = await prisma.cafeTable.findUnique({
    where: { id },
  });

  if (!table) {
    throw new Error("Table not found");
  }

  return prisma.cafeTable.update({
    where: { id },
    data: { isInUse },
    include: {
      orders: {
        where: { isCancelled: false },
      },
    },
  });
}
