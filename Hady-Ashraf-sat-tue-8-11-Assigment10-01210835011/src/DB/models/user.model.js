import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 50,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      min: 8,
      required: true,
    },
    phone: {
      type: String,
      min: 11,
      max: 12,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
