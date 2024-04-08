import { StatusCodes } from "http-status-codes";
import Job from "../models/JobModel.js";
import User from "../models/UserModel.js";
import cloudinary from "cloudinary";
import { promises as fs } from "fs";

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const userWithoutPassword = user.toJSON();
  res.status(StatusCodes.OK).json({ user: userWithoutPassword });
};

const getApplicationStats = async (req, res) => {
  const users = await User.countDocuments();
  const jobs = await Job.countDocuments();

  res.status(StatusCodes.OK).json({ users, jobs });
};

const updateUser = async (req, res) => {
  let newUser = { ...req.body };
  if (newUser.password) {
    delete newUser.password;
  }

  if (req.file) {
    const response = await cloudinary.v2.uploader.upload(req.file.path);
    await fs.unlink(req.file.path);
    newUser.avatar = response.secure_url;
    newUser.avatarPublicId = response.public_id;
  }

  const updatedUser = await User.findByIdAndUpdate(req.user.userId, newUser);

  if (req.file && updatedUser.avatarPublicId) {
    await cloudinary.v2.uploader.destroy(updateUser.avatarPublicId);
  }

  res.status(StatusCodes.OK).json({ msg: "user updated" });
};

export { getCurrentUser, getApplicationStats, updateUser };
