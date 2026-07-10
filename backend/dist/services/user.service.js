"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../prisma");
function getUsers() {
    return prisma_1.prisma.user.findMany({
        include: {
            role: true,
        },
    });
}
async function createUser(body) {
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: { email: body.email },
    });
    if (existingUser) {
        throw new Error("Email already exists");
    }
    const role = await prisma_1.prisma.role.findUnique({
        where: { id: body.roleId },
    });
    if (!role) {
        throw new Error("Role not found");
    }
    const passwordHash = await bcrypt_1.default.hash(body.password, 10);
    return prisma_1.prisma.user.create({
        data: {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            passwordHash,
            roleId: body.roleId,
            isActive: true,
        },
        include: {
            role: true,
        },
    });
}
async function updateUser(id, body) {
    const data = {};
    if (body.firstName !== undefined) {
        data.firstName = body.firstName;
    }
    if (body.lastName !== undefined) {
        data.lastName = body.lastName;
    }
    if (body.email !== undefined) {
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: { email: body.email },
        });
        if (existingUser && existingUser.id !== id) {
            throw new Error("Email already in use");
        }
        data.email = body.email;
    }
    if (body.password !== undefined) {
        data.passwordHash = await bcrypt_1.default.hash(body.password, 10);
    }
    if (body.roleId !== undefined) {
        const role = await prisma_1.prisma.role.findUnique({
            where: { id: body.roleId },
        });
        if (!role) {
            throw new Error("Role not found");
        }
        data.roleId = body.roleId;
    }
    if (body.isActive !== undefined) {
        data.isActive = body.isActive;
    }
    return prisma_1.prisma.user.update({
        where: { id },
        data,
        include: {
            role: true,
        },
    });
}
//# sourceMappingURL=user.service.js.map