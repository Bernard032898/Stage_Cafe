"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
const auth_service_1 = require("../services/auth.service");
async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }
    try {
        const result = await (0, auth_service_1.login)(email, password);
        return res.json(result);
    }
    catch (error) {
        console.error("Login failed:", error);
        return res.status(401).json({
            message: "Invalid credentials"
        });
    }
}
//# sourceMappingURL=auth.controller.js.map