import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("DATABASE CONNECTED SUCCESSFULLY ✅");
  } catch (err) {
    console.error("Error Connecting Database ❌", err);
    process.exit(1);
  }
};
