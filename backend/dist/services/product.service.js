"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = getProducts;
exports.getCategories = getCategories;
exports.createProduct = createProduct;
const prisma_1 = require("../prisma");
function getProducts() {
    return prisma_1.prisma.product.findMany({
        include: {
            category: true,
        },
        orderBy: {
            name: "asc",
        },
    });
}
function getCategories() {
    return prisma_1.prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });
}
async function createProduct(data) {
    const { categoryName, categoryId, stock, ...rest } = data;
    let resolvedCategoryId = categoryId;
    if (!resolvedCategoryId && categoryName) {
        const category = await prisma_1.prisma.category.upsert({
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
    return prisma_1.prisma.product.create({
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
//# sourceMappingURL=product.service.js.map