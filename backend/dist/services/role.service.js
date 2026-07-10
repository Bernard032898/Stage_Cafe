"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoles = getRoles;
exports.createRole = createRole;
exports.updateRole = updateRole;
const prisma_1 = require("../prisma");
function getRoles() {
    return prisma_1.prisma.role.findMany();
}
async function createRole(name) {
    const existingRole = await prisma_1.prisma.role.findUnique({
        where: { name },
    });
    if (existingRole) {
        throw new Error("Role already exists");
    }
    return prisma_1.prisma.role.create({
        data: { name },
    });
}
async function updateRole(id, name) {
    const existingRole = await prisma_1.prisma.role.findUnique({
        where: { name },
    });
    if (existingRole && existingRole.id !== id) {
        throw new Error("Role name already in use");
    }
    return prisma_1.prisma.role.update({
        where: { id },
        data: { name },
    });
}
//# sourceMappingURL=role.service.js.map