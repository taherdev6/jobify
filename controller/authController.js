import { StatusCodes } from "http-status-codes";
import { UnauthenticatedError } from "../errors/customError.js";
import User from "../models/UserModel.js";
import { hashPassword, comparePasswords } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";
const register = async (req, res) => {
  const users = await User.countDocuments();
  const role = users === 0 ? "admin" : "user";
  req.body.role = role;
  req.body.password = await hashPassword(req.body.password);

  const user = await User.create(req.body);
  const newUser = {
    name: user.name,
    email: user.email,
  };
  res.status(StatusCodes.CREATED).json({ msg: "user created!" });
};
const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPassword = await comparePasswords(req.body.password, user?.password);

  if (!isPassword) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const token = createJWT({ userId: user._id, role: user.role });

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ msg: "user logged in" });
};

const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

export { login, register, logout };
