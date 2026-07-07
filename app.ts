import express from "express";
import authRouter from "./auth/auth.routes.js";
import { limiter } from "./utils/rateLimiter.js";

const app = express();

app.use(limiter);
app.use("api/v1/", authRouter);

export default app;
