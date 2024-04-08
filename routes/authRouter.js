import express from "express";
import { login, logout, register } from "../controller/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validationMiddleware.js";
const router = express.Router();

router.post("/login", validateLogin, login);
router.post("/register", validateRegister, register);
router.get("/logout", logout);
export default router;
