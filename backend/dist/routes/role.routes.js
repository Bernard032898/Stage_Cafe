"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = require("../controllers/role.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin);
router.get("/", role_controller_1.getRoles);
router.post("/", role_controller_1.createRole);
router.put("/:id", role_controller_1.updateRole);
exports.default = router;
//# sourceMappingURL=role.routes.js.map