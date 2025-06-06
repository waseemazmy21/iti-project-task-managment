import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    await mongoose.connect(uri);
    console.log("[MongoDB] connected successfully");
  } catch (error) {
    console.error("[MongoDB] connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
