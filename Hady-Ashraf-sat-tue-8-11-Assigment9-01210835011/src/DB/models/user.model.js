import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 20,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    phone: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    img: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
