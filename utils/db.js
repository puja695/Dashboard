import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/jobboard";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  console.log("📦 MongoDB connected");
}
