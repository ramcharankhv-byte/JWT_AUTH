import express from "express";
import authRouter from "./auth/auth.routes.js";

const app = express();

app.use("api/v1/", authRouter);

export default app;
