import mongoose from "mongoose";
const { Schema } = mongoose;

const noteSchema = new Schema(
  {
    tittle: {
      type: String,
      min: 5,
      max: 30,
      required: true,
      validate: {
        validator: function (value) {
          return value !== value.toUpperCase();
        },
      },
    },
    content: { type: String, min: 15, max: 200, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
