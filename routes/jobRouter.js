import { Router } from "express";
import {
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  createJob,
  showStats,
} from "../controller/jobController.js";
import {
  validateJobInput,
  validateIdParam,
} from "../middleware/validationMiddleware.js";
import { checkTestUser } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/", getAllJobs);

router.get("/stats", showStats);

router.get("/:id", validateIdParam, getSingleJob);

router.post("/", checkTestUser, validateJobInput, createJob);

router.patch(
  "/:id",
  checkTestUser,
  validateIdParam,
  validateJobInput,
  updateJob
);

router.delete("/:id", checkTestUser, validateIdParam, deleteJob);

export default router;
