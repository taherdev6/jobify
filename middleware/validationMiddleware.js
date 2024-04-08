import { body, param, validationResult } from "express-validator";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../errors/customError.js";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";
const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith("no job"))
          throw new NotFoundError(errorMessages);

        if (errorMessages[0].startsWith("not authorized"))
          throw new UnauthorizedError("not authorized to access this route");

        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

export const validateJobInput = withValidationErrors([
  body("company").notEmpty().withMessage("please provide company"),

  body("position").notEmpty().withMessage("please provide position"),

  body("jobLocation").notEmpty().withMessage("please provide location"),
  body("jobStatus")
    .isIn(Object.values(JOB_STATUS))
    .withMessage("invalid status value"),
  body("jobType")
    .isIn(Object.values(JOB_TYPE))
    .withMessage("invalid type value"),
]);

export const validateIdParam = withValidationErrors([
  param("id").custom(async (value, { req }) => {
    const isValidId = mongoose.Types.ObjectId.isValid(value);
    if (!isValidId) {
      throw new Error("invalid MongoDB id");
    }

    const job = await Job.findById(value);
    if (!job) {
      throw new Error(`no job found with id: ${value}`);
    }

    const { userId, role } = req.user;
    const isAdmin = role === "admin";
    const isOwner = userId === job.createdBy.toString();
    if (!isAdmin && !isOwner) {
      throw new Error(`not authorized to access this route`);
    }

    return true;
  }),
]);

export const validateRegister = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("please provide name")
    .isLength({ min: 3, max: 50 })
    .withMessage("name must be between 3 and 50 characters"),
  body("email")
    .notEmpty()
    .withMessage("please provide email")
    .isEmail()
    .withMessage("please provide valid email")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) throw new Error("user already exists");
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("please provide password")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
  body("lastName").notEmpty().withMessage("please provide last name"),
  body("location").notEmpty().withMessage("please provide location"),
]);

export const validateLogin = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("please provide email")
    .isEmail()
    .withMessage("please provide valid email"),
  body("password").notEmpty().withMessage("please provide password"),
]);

export const validateUpdateUser = withValidationErrors([
  body("name")
    .notEmpty()
    .withMessage("please provide name")
    .isLength({ min: 3, max: 50 })
    .withMessage("name must be between 3 and 50 characters"),
  body("email")
    .notEmpty()
    .withMessage("please provide email")
    .isEmail()
    .withMessage("please provide valid email")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId)
        throw new Error("email already exists");
      return true;
    }),
  body("lastName").notEmpty().withMessage("please provide last name"),
  body("location").notEmpty().withMessage("please provide location"),
]);
