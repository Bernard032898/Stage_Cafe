"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const app_1 = __importDefault(require("./app"));
const prisma_1 = require("./prisma");
const PORT = process.env.PORT || 3000;
async function ensureSeedData() {
    const existingUser = await prisma_1.prisma.user.findFirst();
    if (existingUser) {
        return;
    }
    const adminRole = await prisma_1.prisma.role.upsert({
        where: { name: "Admin" },
        update: {},
        create: { name: "Admin" },
    });
    const category = await prisma_1.prisma.category.upsert({
        where: { name: "Coffee" },
        update: {},
        create: { name: "Coffee" },
    });
    await prisma_1.prisma.product.create({
        data: {
            name: "Latte",
            price: 5.5,
            categoryId: category.id,
        },
    });
    await prisma_1.prisma.cafeTable.upsert({
        where: { tableNumber: 1 },
        update: {},
        create: { tableNumber: 1 },
    });
    const passwordHash = await bcrypt_1.default.hash("admin123", 10);
    await prisma_1.prisma.user.create({
        data: {
            firstName: "Admin",
            lastName: "User",
            email: "admin@stagecafe.com",
            passwordHash,
            roleId: adminRole.id,
        },
    });
}
async function startServer() {
    await prisma_1.prisma.$connect();
    await ensureSeedData();
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
startServer().catch((error) => {
    console.error(error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map