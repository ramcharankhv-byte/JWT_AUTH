import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshAuthTokens,
  logout,
  getUser,
} from "./auth.controller.js";
import { verifyJwt } from "./auth.middleware.js";

const authRouter = Router();

authRouter.post("/auth/register", registerUser);

authRouter.post("/auth/login", loginUser);

authRouter.use(verifyJwt).get("/profile", getUser);

authRouter.use(verifyJwt).patch("/auth/refresh", refreshAuthTokens);

authRouter.use(verifyJwt).post("auth/logout", logout);

export default authRouter;
