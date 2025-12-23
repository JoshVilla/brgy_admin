import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_ATLAS_DB_LINK;

// Ensure global object exists for caching (important for Next.js and serverless)
// @ts-ignore
global.mongoose = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
  // @ts-ignore
  if (global.mongoose.conn) {
    console.log("Using existing MongoDB connection");
    // @ts-ignore
    return global.mongoose.conn;
  }

  // @ts-ignore
  if (!global.mongoose.promise) {
    console.log("Establishing new MongoDB connection...");
    // @ts-ignore
    global.mongoose.promise = mongoose
      // @ts-ignore
      .connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // 30 seconds
        connectTimeoutMS: 30000, // 30 seconds
      })
      .then((mongoose) => {
        console.log("MongoDB connected successfully ✅");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw new Error("Failed to connect to MongoDB.");
      });
  }

  // @ts-ignore
  global.mongoose.conn = await global.mongoose.promise;
  // @ts-ignore
  return global.mongoose.conn;
}
