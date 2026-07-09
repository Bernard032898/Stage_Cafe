import { Router } from "express";
import {
  getAllOrders,
  createOrder
} from "../controllers/order.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getAllOrders);
router.post("/", authenticate, createOrder);

export default router;