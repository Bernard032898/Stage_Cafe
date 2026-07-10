import { Router } from "express";
import {
  getAllTables,
  createTable,
  deleteTable,
  updateTableStatus,
} from "../controllers/table.controller";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, getAllTables);
router.post("/", authenticate, authorizeAdmin, createTable);
router.patch("/:id/status", authenticate, updateTableStatus);
router.delete("/:id", authenticate, authorizeAdmin, deleteTable);

export default router;
