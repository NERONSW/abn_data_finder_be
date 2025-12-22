import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app";

dotenv.config();

const port: number = Number(process.env.PORT) || 3000;

// Validate MongoDB URL
const MONGO_URL = process.env.MONGO_DB_URL;
if (!MONGO_URL) {
  throw new Error("❌ MONGO_DB_URL is missing in environment variables");
}

const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URL);
    console.log("✅ MongoDB connected successfully!");

    // Start server
    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  } catch (err: any) {
    console.error("❌ App start error:", err.message);
    process.exit(1);
  }
};

startServer();
