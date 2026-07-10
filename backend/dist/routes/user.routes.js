"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin);
router.get("/", user_controller_1.getUsers);
router.post("/", user_controller_1.createUser);
router.put("/:id", user_controller_1.updateUser);
router.patch("/:id/status", user_controller_1.updateUserStatus);
exports.default = router;
//# sourceMappingURL=user.routes.js.map