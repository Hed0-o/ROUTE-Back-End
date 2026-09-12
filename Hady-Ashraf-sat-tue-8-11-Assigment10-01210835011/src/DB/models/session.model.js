import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    device: {
      type: String,
      default: "unknown",
    },
  },
  {
    timestamps: true,
  },
);

const Session = mongoose.model("Session", sessionSchema);

export default Session;
