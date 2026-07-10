import { Router } from "express";
import {
  getAllProducts,
  getAllCategories,
  createProduct,
} from "../controllers/product.controller";

const router = Router();

router.get("/", getAllProducts);
router.get("/categories", getAllCategories);
router.post("/", createProduct);

export default router;