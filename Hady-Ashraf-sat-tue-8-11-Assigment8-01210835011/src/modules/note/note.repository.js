import mongoose from "mongoose";
import Note from "../../DB/models/note.model.js";

export const createNote = (data) => {
  return Note.create(data);
};

export const findNoteById = (id) => {
  return Note.findById(id);
};

export const replaceNote = (noteId, data) => {
  return Note.findOneAndReplace({ _id: noteId }, data, {
    returnDocument: "after",
  });
};

export const updateManyTitles = (userId, title) => {
  return Note.updateMany({ userId }, { title });
};

export const findByIdAndUpdate = (id, updateData, options) => {
  return Note.findByIdAndUpdate(id, updateData, options);
};

export const findByIdAndDelete = (id) => {
  return Note.findByIdAndDelete(id);
};

export const findNotesPaginated = async ({ userId, skip, limit }) => {
  const notes = await Note.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const totalCount = await Note.countDocuments({ userId });
  return { notes, totalCount };
};

export const findNotesByContent = (userId, content) => {
  return Note.find({
    userId,
    content: { $regex: content, $options: "i" },
  });
};

export const findNotesWithUser = (userId) => {
  return Note.find({ userId })
    .select("title userId createdAt")
    .populate("userId", "email");
};

//(aggregateUserNotes) From Gpt
export const aggregateUserNotes = (userId, title) => {
  const matchStage = {
    userId: new mongoose.Types.ObjectId(userId),
  };
  if (title) {
    matchStage.title = { $regex: title, $options: "i" };
  }
  return Note.aggregate([
    { $match: matchStage },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        title: 1,
        content: 1,
        createdAt: 1,
        "user.name": 1,
        "user.email": 1,
      },
    },
  ]);
};

export const deleteAllUserNotes = (userId) => {
  return Note.deleteMany({ userId });
};
