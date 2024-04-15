import "express-async-errors";
import * as dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import cloudinary from "cloudinary";

// security
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";

// routers
import jobRouter from "./routes/jobRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
// middleware
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";
import { authenticateUser } from "./middleware/authMiddleware.js";

//public
import path, { dirname } from "path";
import { fileURLToPath } from "url";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

const port = process.env.PORT || 5000;

const __dirname = dirname(fileURLToPath(import.meta.url));

// middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(path.resolve(__dirname, "./client/dist")));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
// routers

app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", authenticateUser, userRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/dist", "index.html"));
});

app.use("*", (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ msg: "not found" });
});

app.use(errorHandlerMiddleware);

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
