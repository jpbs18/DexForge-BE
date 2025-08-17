import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not defined in environment variables");
  process.exit(1);
}

const connectDB = async (): Promise<void> => {
  let retries = 5;
  while (retries > 0) {
    try {
      await mongoose.connect(MONGO_URI);
      console.log("✅ MongoDB connected");
      break;
    } catch (error) {
      retries -= 1;

      console.error(
        `❌ MongoDB connection failed. Retries left: ${retries}`,
        error
      );

      if (retries === 0) {
        console.error("❌ Could not connect to MongoDB. Exiting...");
        process.exit(1);
      }

      await new Promise((res) => setTimeout(res, 5000));
    }
  }
};

process.on("SIGINT", async () => {
  console.log("⚡ SIGINT received. Closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("⚡ SIGTERM received. Closing MongoDB connection...");
  await mongoose.connection.close();
  process.exit(0);
});

export default connectDB;
