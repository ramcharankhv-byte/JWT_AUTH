import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAuthTokens,
  logout,
  getUser,
} from "./auth.controller.js";
import { verifyJwt } from "./auth.middleware.js";
import { validate } from "../utils/validator.js";
import { emailSchema, loginSchema, passwordSchema } from "./auth.validator.js";

const authRouter = Router();

authRouter.post("/register", validate(loginSchema, "body"), registerUser);

authRouter.post("/login", validate(loginSchema, "body"), loginUser);

authRouter.use(verifyJwt).get("/profile", getUser);

authRouter.patch("/refresh", refreshAuthTokens);

authRouter.use(verifyJwt).post("/logout", logout);

export default authRouter;
