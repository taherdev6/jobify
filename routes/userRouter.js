import { Router } from "express";
import {
  getApplicationStats,
  getCurrentUser,
  updateUser,
} from "../controller/userController.js";

import { validateUpdateUser } from "../middleware/validationMiddleware.js";

import {
  authorizePermissions,
  checkTestUser,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/multerMiddleware.js";
const router = Router();

router.get("/current-user", getCurrentUser);
router.get(
  "/admin/app-stats",
  authorizePermissions("admin"),
  getApplicationStats
);
router.patch(
  "/update-user",
  checkTestUser,
  upload.single("avatar"),
  validateUpdateUser,
  updateUser
);

export default router;
