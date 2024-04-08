import {
  BadRequestError,
  UnauthenticatedError,
  UnauthorizedError,
} from "../errors/customError.js";
import { verifyJWT } from "../utils/tokenUtils.js";
export const authenticateUser = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) throw new UnauthenticatedError("authentication invalid");
  try {
    const { userId, role } = verifyJWT(token);
    const testUser = userId === "6605773a09cfeef6d8f5271a";
    req.user = { userId, role, testUser };
    next();
  } catch (error) {
    throw new UnauthenticatedError("authentication invalid");
  }
};

export const checkTestUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequestError("Demo User. Read Only!");
  }
  next();
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError("unauthorized to access this route");
    next();
  };
};
