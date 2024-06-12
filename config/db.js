import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const dbURL = process.env.MONGODB_URL;
export const connectDB = async () => {
  await mongoose.connect(dbURL).then(() => console.log("Database Connected!"));
};
