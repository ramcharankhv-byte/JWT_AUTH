import User, { type IUser } from "./auth.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { type JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/acyncHandler.js";
import {
  generateTokens,
  register,
  login,
  refreshTokens,
} from "./auth.services.js";

interface generateTokens {
  accessToken: string;
  refreshToken: string;
}

interface CustomJwtPayload extends JwtPayload {
  _id: string;
  issuedAt: number;
  expiresAt: number;
  email?: string;
}

export const registerUser = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  const { createdUser, accessToken, refreshToken } = await register(
    email,
    password,
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(202)
    .json(
      new ApiResponse(
        200,
        { createdUser, accessToken, refreshToken },
        "User Created",
      ),
    );
});

export const loginUser = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  const { createdUser, accessToken, refreshToken } = await login(
    email,
    password,
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .status(202)
    .json(
      new ApiResponse(
        200,
        { createdUser, accessToken, refreshToken },
        "User LoggedIn",
      ),
    );
});

export const getUser = asyncHandler(async (req: any, res: any) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  return res.status(201).json(new ApiResponse(201, user, "User Fetched"));
});

export const refreshAuthTokens = asyncHandler(async (req: any, res: any) => {
  const incomingToken = req.cookie.refreshToken;

  const { accessToken, newRefreshToken } = await refreshTokens(incomingToken);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .status(201)
    .json(
      new ApiResponse(
        201,
        { accessToken, newRefreshToken },
        "Tokens Refreshed",
      ),
    );
});

export const logout = asyncHandler(async (req: any, res: any) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: "",
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged Out"));
});
