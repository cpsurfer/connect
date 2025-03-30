import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully", conn.connection.host);
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
}

export default connectMongoDB;