import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAuthTokens,
  logout,
  getUser,
} from "./auth.controller.js";
import { verifyJwt } from "./auth.middleware.js";
import { validate } from "../validator.js";
import { emailSchema, passwordSchema } from "./auth.validator.js";

const authRouter = Router();

authRouter.post(
  "/auth/register",
  validate(emailSchema, "body"),
  validate(passwordSchema, "body"),
  registerUser,
);

authRouter.post(
  "/auth/login",
  validate(emailSchema, "body"),
  validate(passwordSchema, "body"),
  loginUser,
);

authRouter.use(verifyJwt).get("/profile", getUser);

authRouter.use(verifyJwt).patch("/auth/refresh", refreshAuthTokens);

authRouter.use(verifyJwt).post("auth/logout", logout);

export default authRouter;
