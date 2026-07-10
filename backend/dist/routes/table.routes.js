"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const table_controller_1 = require("../controllers/table.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, table_controller_1.getAllTables);
router.post("/", auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, table_controller_1.createTable);
router.patch("/:id/status", auth_middleware_1.authenticate, table_controller_1.updateTableStatus);
router.delete("/:id", auth_middleware_1.authenticate, auth_middleware_1.authorizeAdmin, table_controller_1.deleteTable);
exports.default = router;
//# sourceMappingURL=table.routes.js.map