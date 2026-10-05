import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Successfully connected to MongoDB!");
    return mongoose;
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    process.exit(1);
  }
}

// Call this only when your application terminates
export async function disconnectDB() {
  await mongoose.connection.close();
}
