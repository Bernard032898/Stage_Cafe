"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.authenticate, order_controller_1.getAllOrders);
router.post("/", auth_middleware_1.authenticate, order_controller_1.createOrder);
router.post("/bulk", auth_middleware_1.authenticate, order_controller_1.createMultipleOrders);
router.patch("/:id/complete", auth_middleware_1.authenticate, order_controller_1.completeOrder);
router.patch("/:id/cancel", auth_middleware_1.authenticate, order_controller_1.cancelOrder);
router.get("/tables", auth_middleware_1.authenticate, order_controller_1.getTables);
router.get("/income", auth_middleware_1.authenticate, order_controller_1.getIncome);
router.get("/top-products", auth_middleware_1.authenticate, order_controller_1.getTopProducts);
exports.default = router;
//# sourceMappingURL=order.routes.js.map