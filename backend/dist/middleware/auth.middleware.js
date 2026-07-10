"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorizeAdmin = authorizeAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res
            .status(401)
            .json({
            message: "Token required"
        });
    }
    const token = header.replace("Bearer ", "");
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user =
            payload;
        next();
    }
    catch {
        return res
            .status(401)
            .json({
            message: "Invalid token"
        });
    }
}
function authorizeAdmin(req, res, next) {
    const user = req.user;
    if (!user || user.role !== "Admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}
//# sourceMappingURL=auth.middleware.js.map