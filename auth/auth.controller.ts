import User, { type IUser } from "./auth.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { type JwtPayload } from "jsonwebtoken";

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

const generateTokens = async (userId: any): Promise<generateTokens> => {
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

export const registerUser = async (req: any, res: any) => {
  const { email, password } = req.body;

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

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
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
};

export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;

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

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
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
};

export const getUser = async (req: any, res: any) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  return res.status(201).json(new ApiResponse(201, user, "User Fetched"));
};

export const refreshTokens = async (req: any, res: any) => {
  const incomingToken = req.cookie.refreshToken;

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

  user.refreshToken = newRefreshToken;

  await user.save();

  return { accessToken, newRefreshToken };
};

export const logout = async (req: any, res: any) => {
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged Out"));
};
