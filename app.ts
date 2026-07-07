import express from "express";
import helmet from "helmet";
import authRouter from "./auth/auth.routes.js";
import { limiter } from "./utils/rateLimiter.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

app.use("/", (req: any, res: any) => {
  res.send("Hellow World");
});

app.use((err: any, req: any, res: any, next: any) => {
  return res.status(err.statusCode || 500).json({
    success: err.success || false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export default app;
