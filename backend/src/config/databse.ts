import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("====================================");
    console.log("✅ MongoDB connected successfully");
    console.log("====================================");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // exit with failure
    // status code 1 means failure
    // status code 0 means success
  }
};
