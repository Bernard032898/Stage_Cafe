"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTables = getAllTables;
exports.createTable = createTable;
exports.deleteTable = deleteTable;
exports.updateTableStatus = updateTableStatus;
const prisma_1 = require("../prisma");
function getAllTables() {
    return prisma_1.prisma.cafeTable.findMany({
        include: {
            orders: {
                where: { isCancelled: false },
            },
        },
        orderBy: { tableNumber: "asc" },
    });
}
async function createTable() {
    // Auto-generate next table number
    const lastTable = await prisma_1.prisma.cafeTable.findFirst({
        orderBy: { tableNumber: "desc" },
    });
    const nextTableNumber = (lastTable?.tableNumber || 0) + 1;
    return prisma_1.prisma.cafeTable.create({
        data: { tableNumber: nextTableNumber },
    });
}
async function deleteTable(id) {
    const table = await prisma_1.prisma.cafeTable.findUnique({
        where: { id },
        include: { orders: true },
    });
    if (!table) {
        throw new Error("Table not found");
    }
    if (table.orders && table.orders.length > 0) {
        throw new Error("Cannot delete table with existing orders");
    }
    return prisma_1.prisma.cafeTable.delete({
        where: { id },
    });
}
async function updateTableStatus(id, isInUse) {
    const table = await prisma_1.prisma.cafeTable.findUnique({
        where: { id },
    });
    if (!table) {
        throw new Error("Table not found");
    }
    return prisma_1.prisma.cafeTable.update({
        where: { id },
        data: { isInUse },
        include: {
            orders: {
                where: { isCancelled: false },
            },
        },
    });
}
//# sourceMappingURL=table.service.js.map