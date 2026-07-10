"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.updateUserStatus = updateUserStatus;
const userService = __importStar(require("../services/user.service"));
async function getUsers(req, res) {
    const users = await userService.getUsers();
    res.json(users);
}
async function createUser(req, res) {
    const { firstName, lastName, email, password, roleId, } = req.body;
    if (!firstName || !lastName || !email || !password || !roleId) {
        return res.status(400).json({
            message: "firstName, lastName, email, password, and roleId are required",
        });
    }
    try {
        const user = await userService.createUser({
            firstName,
            lastName,
            email,
            password,
            roleId,
        });
        return res.status(201).json(user);
    }
    catch (error) {
        console.error("Create user failed:", error);
        return res.status(400).json({
            message: error?.message || "Unable to create user",
        });
    }
}
async function updateUser(req, res) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { firstName, lastName, email, password, roleId, isActive, } = req.body;
    if (!id) {
        return res.status(400).json({ message: "User id is required" });
    }
    try {
        const user = await userService.updateUser(id, {
            firstName,
            lastName,
            email,
            password,
            roleId,
            isActive,
        });
        return res.json(user);
    }
    catch (error) {
        console.error("Update user failed:", error);
        return res.status(400).json({
            message: error?.message || "Unable to update user",
        });
    }
}
async function updateUserStatus(req, res) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const rawIsActive = Array.isArray(req.body?.isActive)
        ? req.body.isActive[0]
        : req.body?.isActive;
    const isActive = typeof rawIsActive === "boolean" ? rawIsActive : undefined;
    if (typeof isActive !== "boolean") {
        return res.status(400).json({
            message: "isActive must be a boolean",
        });
    }
    try {
        const user = await userService.updateUser(id, { isActive });
        return res.json(user);
    }
    catch (error) {
        console.error("Update user status failed:", error);
        return res.status(400).json({
            message: error?.message || "Unable to update user status",
        });
    }
}
//# sourceMappingURL=user.controller.js.map