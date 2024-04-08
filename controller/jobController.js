import Job from "../models/JobModel.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import dayjs from "dayjs";
export const getAllJobs = async (req, res) => {
  const query = {};
  const sortObj = {};
  const { sort } = req.query;
  if (req.query.search) {
    query.position = new RegExp(`^${req.query.search}`, "gi");
  }

  if (req.query.jobStatus && req.query.jobStatus !== "all") {
    query.jobStatus = req.query.jobStatus;
  }

  if (req.query.jobType && req.query.jobType !== "all") {
    query.jobType = req.query.jobType;
  }

  if (sort) {
    if (sort === "newest") sortObj.createdAt = -1;
    if (sort === "oldest") sortObj.createdAt = 1;
    if (sort === "a-z") sortObj.position = 1;
    if (sort === "z-a") sortObj.position = -1;
  } else {
    sortObj.createdAt = -1;
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find({
    createdBy: req.user.userId,
    ...query,
  })
    .sort(sortObj)
    .limit(limit)
    .skip(skip);

  const totalJobs = await Job.countDocuments({
    createdBy: req.user.userId,
    ...query,
  });
  const numOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
};

export const getSingleJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findOne({ _id: id });

  res.status(StatusCodes.OK).json({ job });
};

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

export const updateJob = async (req, res) => {
  const { id } = req.params;

  const job = await Job.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({ job, msg: `Job Updated!` });
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findOneAndDelete({ _id: id });

  res.status(StatusCodes.OK).json({ msg: `Job Deleted!` });
};

export const showStats = async (req, res) => {
  const stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: "$jobStatus",
        count: { $count: {} },
      },
    },
  ]);

  const defaultStats = {};
  stats.forEach((obj) => {
    defaultStats[obj._id] = obj.count;
  });

  const monthPeriod = dayjs(new Date(Date.now())).subtract(6, "month");

  const applications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },

    { $group: { _id: "$createdAt", count: { $count: {} } } },
    {
      $sort: { _id: 1 },
    },
  ]);
  const filteredApplications = applications
    .filter((ISODate) => {
      const date = dayjs(ISODate._id);
      return date.isAfter(monthPeriod);
    })
    .reduce((acc, curr) => {
      const date = dayjs(curr._id);
      const formattedDate = `${date.format("MMM YY")}`;

      if (!acc[formattedDate]) {
        acc[formattedDate] = curr.count;
      }

      acc[formattedDate] = acc[formattedDate] + 1;

      return acc;
    }, {});
  const monthlyApplications = Object.entries(filteredApplications).map(
    (entry) => {
      return {
        date: entry[0],
        count: entry[1],
      };
    }
  );

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
