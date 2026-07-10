import { Router } from "express";
import {
  getAllOrders,
  createOrder,
  createMultipleOrders,
  completeOrder,
  cancelOrder,
  getTables,
  getIncome,
  getTopProducts,
} from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getAllOrders);
router.post("/", authenticate, createOrder);
router.post("/bulk", authenticate, createMultipleOrders);
router.patch("/:id/complete", authenticate, completeOrder);
router.patch("/:id/cancel", authenticate, cancelOrder);
router.get("/tables", authenticate, getTables);
router.get("/income", authenticate, getIncome);
router.get("/top-products", authenticate, getTopProducts);

export default router;