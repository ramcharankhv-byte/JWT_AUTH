import z from "zod";

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Invalid email address format" });

export const passwordSchema = z
  .string()
  .min(6, "Password must contain a minimum fo 6 characters")
  .trim()
  .nonempty({ message: "Password must not be empty" });
