import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  email: string;
  password?: string;
  refreshToken: string;
  isPassCorrect(password: string): Promise<boolean>;
  generateRefreshToken(): Promise<string>;
  generateAccessToken(): Promise<string>;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  try {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    return;
  } catch (error: any) {
    return;
  }
});

userSchema.methods.isPassCorrect = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateRefreshToken = async function (
  this: IUser,
): Promise<string> {
  const now = Date.now();
  return jwt.sign(
    {
      _id: this._id,
      issuedAt: now,
      expiresAt: now + 7 * 24 * 60 * 60 * 1000,
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any },
  );
};

userSchema.methods.generateAccessToken = async function (
  this: IUser,
): Promise<string> {
  const now = Date.now();
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      issuedAt: now,
      expiresAt: now + 15 * 60 * 1000,
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any },
  );
};
const User = mongoose.model<IUser>("User", userSchema);

export default User;
