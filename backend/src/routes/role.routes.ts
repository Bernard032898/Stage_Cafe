import { Router } from "express";
import {
  getRoles,
  createRole,
  updateRole,
} from "../controllers/role.controller";
import {
  authenticate,
  authorizeAdmin,
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate, authorizeAdmin);
router.get("/", getRoles);
router.post("/", createRole);
router.put("/:id", updateRole);

export default router;
