import mongoose from "mongoose";
import { seedApiConfigs } from "./seedApiConfig.js";

export const mongoConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI).then((res) => {
      seedApiConfigs();
      console.log("Successfully connected to DB");
    });
  } catch (error) {
    console.log("Error Connecting", error);
    process.exit(1);
  }
};
