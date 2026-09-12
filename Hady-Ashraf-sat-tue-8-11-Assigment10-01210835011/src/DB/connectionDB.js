import mongoose from "mongoose";

const dbConnectionStatus = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test");
    console.log(`Successfully connected to DB.`);
  } catch (error) {
    console.log(`Can't connect to DB.`, error);
  }
};

export default dbConnectionStatus;
