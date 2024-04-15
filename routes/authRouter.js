import express from "express";
import { login, logout, register } from "../controller/authController.js";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validationMiddleware.js";
import rateLimiter from "express-rate-limit";
const router = express.Router();

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    msg: "Too many requests, retry in 15 minutes",
  },
});

router.post("/login", apiLimiter, validateLogin, login);
router.post("/register", apiLimiter, validateRegister, register);
router.get("/logout", logout);
export default router;
