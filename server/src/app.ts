import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import path from "node:path";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/users.routes";
import postRoutes from "./routes/posts.routes";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", true);

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(","),
    credentials: true
  })
);

app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use(errorHandler);

export default app;
