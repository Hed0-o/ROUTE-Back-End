import Note from "../../DB/models/note.model.js";
import * as db from "../../common/services/base.repository.js";

export const createNote = (data) => {
  return db.create(Note, data);
};

export const findNotes = (data) => {
  return db.find(Note, data);
};

export const findNoteById = ({ noteId }) => {
  return db.findById(Note, noteId);
};

export const findNoteByIdAndUpdate = ({ noteId, ...updateData }) => {
  return db.findByIdAndUpdate(Note, noteId, updateData);
};

export const findNoteByIdAndDelete = ({ noteId }) => {
  return db.findByIdAndDelete(Note, noteId);
};
