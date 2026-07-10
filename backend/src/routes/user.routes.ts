import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  updateUserStatus,
} from "../controllers/user.controller";
import {
  authenticate,
  authorizeAdmin,
} from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate, authorizeAdmin);
router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.patch("/:id/status", updateUserStatus);

export default router;
