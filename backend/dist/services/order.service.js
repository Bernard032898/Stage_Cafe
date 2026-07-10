"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = getOrders;
exports.getCafeTables = getCafeTables;
exports.createOrder = createOrder;
exports.createMultipleOrders = createMultipleOrders;
exports.markOrderComplete = markOrderComplete;
exports.cancelOrder = cancelOrder;
exports.getIncome = getIncome;
exports.getTopProducts = getTopProducts;
const prisma_1 = require("../prisma");
function getOrders() {
    return prisma_1.prisma.order.findMany({
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
function getCafeTables() {
    return prisma_1.prisma.cafeTable.findMany({
        orderBy: { tableNumber: "asc" },
        select: {
            id: true,
            tableNumber: true,
        },
    });
}
async function createOrder(body) {
    if (!body.userId) {
        throw new Error("userId is required");
    }
    if (!body.tableId && body.tableNumber == null) {
        throw new Error("tableId or tableNumber is required");
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
        throw new Error("items must be a non-empty array");
    }
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: body.userId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    let table = null;
    if (body.tableId) {
        table = await prisma_1.prisma.cafeTable.findUnique({
            where: { id: body.tableId },
        });
    }
    if (!table && body.tableNumber != null) {
        table = await prisma_1.prisma.cafeTable.findUnique({
            where: { tableNumber: Number(body.tableNumber) },
        });
    }
    if (!table) {
        throw new Error("Table not found");
    }
    const tableId = table.id;
    return prisma_1.prisma.$transaction(async (tx) => {
        let total = 0;
        const items = [];
        for (const item of body.items) {
            if (!item.productId) {
                throw new Error("Each item must include productId");
            }
            const quantity = Number(item.quantity ?? 1);
            if (Number.isNaN(quantity) || quantity <= 0) {
                throw new Error("Each item quantity must be a positive number");
            }
            const product = await tx.product.findUnique({
                where: { id: item.productId },
            });
            if (!product) {
                throw new Error(`Product not found: ${item.productId}`);
            }
            if (Number(product.stock) < quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
            const price = Number(product.price);
            total += price * quantity;
            await tx.product.update({
                where: { id: product.id },
                data: { stock: Number(product.stock) - quantity },
            });
            items.push({
                productId: product.id,
                quantity,
                price,
            });
        }
        return tx.order.create({
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
    });
}
async function createMultipleOrders(body) {
    if (!body.userId) {
        throw new Error("userId is required");
    }
    if (!Array.isArray(body.orders) || body.orders.length === 0) {
        throw new Error("orders must be a non-empty array");
    }
    const user = await prisma_1.prisma.user.findUnique({ where: { id: body.userId } });
    if (!user) {
        throw new Error("User not found");
    }
    const results = [];
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
        const table = await prisma_1.prisma.cafeTable.findUnique({ where: { tableNumber } });
        if (!table) {
            throw new Error("Table not found for one of the orders");
        }
        const tableId = table.id;
        const result = await prisma_1.prisma.$transaction(async (tx) => {
            let total = 0;
            const items = [];
            for (const item of ord.items) {
                if (!item.productId) {
                    throw new Error("Each item must include productId");
                }
                const quantity = Number(item.quantity ?? 1);
                if (Number.isNaN(quantity) || quantity <= 0) {
                    throw new Error("Each item quantity must be a positive number");
                }
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product) {
                    throw new Error(`Product not found: ${item.productId}`);
                }
                if (Number(product.stock) < quantity) {
                    throw new Error(`Insufficient stock for ${product.name}`);
                }
                const price = Number(product.price);
                total += price * quantity;
                await tx.product.update({
                    where: { id: product.id },
                    data: { stock: Number(product.stock) - quantity },
                });
                items.push({ productId: product.id, quantity, price });
            }
            return tx.order.create({
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
            });
        });
        results.push(result);
    }
    return results;
}
async function markOrderComplete(orderId) {
    return prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { isCompleted: true },
        include: {
            user: true,
            table: true,
            items: { include: { product: true } },
        },
    });
}
async function cancelOrder(orderId) {
    return prisma_1.prisma.order.update({
        where: { id: orderId },
        data: { isCancelled: true },
        include: {
            user: true,
            table: true,
            items: { include: { product: true } },
        },
    });
}
async function getIncome(period) {
    const now = new Date();
    let start;
    if (period === "day") {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    else if (period === "month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    else {
        start = new Date(now.getFullYear(), 0, 1);
    }
    const agg = await prisma_1.prisma.order.aggregate({
        _sum: { total: true },
        where: {
            createdAt: { gte: start },
            isCompleted: true,
            isCancelled: false,
        },
    });
    const total = agg._sum.total ? Number(agg._sum.total) : 0;
    return { period, total };
}
async function getTopProducts(period) {
    const now = new Date();
    let start;
    if (period === "day") {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }
    else if (period === "month") {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    else {
        start = new Date(now.getFullYear(), 0, 1);
    }
    const orders = await prisma_1.prisma.order.findMany({
        where: {
            createdAt: { gte: start },
            isCompleted: true,
            isCancelled: false,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
    const counts = new Map();
    for (const order of orders) {
        for (const item of order.items) {
            const current = counts.get(item.productId) || { name: item.product?.name || "Unknown", quantity: 0 };
            current.quantity += item.quantity;
            counts.set(item.productId, current);
        }
    }
    return Array.from(counts.entries())
        .map(([productId, entry]) => ({ productId, name: entry.name, quantity: entry.quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5);
}
//# sourceMappingURL=order.service.js.map