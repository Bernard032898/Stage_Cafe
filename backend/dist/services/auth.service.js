"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../prisma");
async function login(email, password) {
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            email
        },
        include: {
            role: true
        }
    });
    if (!user) {
        throw new Error("Invalid credentials");
    }
    const valid = await bcrypt_1.default.compare(password, user.passwordHash);
    if (!valid) {
        throw new Error("Invalid credentials");
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error("JWT_SECRET is not configured");
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        role: user.role.name
    }, jwtSecret, {
        expiresIn: "1d"
    });
    const { passwordHash, ...userWithoutPassword } = user;
    return {
        token,
        user: userWithoutPassword
    };
}
//# sourceMappingURL=auth.service.js.map