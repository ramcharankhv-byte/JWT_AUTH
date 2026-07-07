import { type JwtPayload } from "jsonwebtoken";
export interface tokens {
  accessToken: string;
  refreshToken: string;
}

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  issuedAt: number;
  expiresAt: number;
  email?: string;
}

export const options = {
  httpOnly: true,
  secure: true,
};
