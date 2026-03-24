import mongoose from "mongoose";

const connectDb = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error(
      "❌ MONGO_URI environment variable is required. Please set it in your .env file",
    );
  }

  try {
    await mongoose.connect(uri, {
      retryWrites: true,
      w: "majority",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDb;
