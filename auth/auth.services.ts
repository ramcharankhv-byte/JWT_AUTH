import User, { type IUser } from "./auth.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

import { asyncHandler } from "../utils/acyncHandler.js";
import { type tokens, type CustomJwtPayload, options } from "../utils/types.js";

const findUser = async (userId: any) => {
  const createdUser = await User.findById(userId).select(
    "-password -refreshToken",
  );
  return { createdUser };
};

export const generateTokens = async (userId: any): Promise<tokens> => {
  try {
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Unknown Error Occured while creating tokens");
  }
};

export const register = async (email: any, password: any) => {
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    throw new ApiError(400, "User Already Exists");
  }

  const user = await User.create({
    email: email,
    password: password,
  });

  await user.save();

  const { accessToken, refreshToken } = await generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const createdUser = await findUser(user._id);

  return { createdUser, accessToken, refreshToken };
};

export const login = async (email: any, password: any) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  const passwordVerify = await user.isPassCorrect(password);

  if (!passwordVerify) {
    throw new ApiError(401, "Entered Wrong Password");
  }

  const { accessToken, refreshToken } = await generateTokens(user._id);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const createdUser = await findUser(user._id);
  return { createdUser, accessToken, refreshToken };
};

export const refreshTokens = async (incomingToken: any) => {
  if (!incomingToken) {
    throw new ApiError(404, "No refresh token found please relogin");
  }

  const decodedToken = await jwt.verify(incomingToken, process.env.JWT_SECRET!);

  const user = await User.findById((decodedToken as CustomJwtPayload)?._id);

  if (!user) {
    throw new ApiError(401, "Invalid Token");
  }

  if (incomingToken !== user?.refreshToken) {
    throw new ApiError(401, "No Token Found in DATABASE");
  }

  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(
    user._id,
  );

  return { accessToken, newRefreshToken };
};
