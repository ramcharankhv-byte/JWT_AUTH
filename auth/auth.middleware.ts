import User from "./auth.model.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

interface CustomJwtPayload extends JwtPayload {
  _id: string;
  issuedAt: number;
  expiresAt: number;
  email?: string;
}

export const verifyJwt = async (
  req: any,
  res: any,
  next: any,
): Promise<void> => {
  const token =
    req.cookies?.accessToken ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(404, "No Access Token Found Unauthorized");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await User.findById(
      (decodedToken as CustomJwtPayload)._id,
    ).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(400, "Invalid Token : Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(400, "Invalid Token");
  }
};
