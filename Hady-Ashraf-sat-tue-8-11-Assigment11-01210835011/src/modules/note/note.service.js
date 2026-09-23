import asyncHandler from "../../common/middlewares/asyncHandler.js";
import responseHandler from "../../common/utils/responseHandler.js";
import * as noteRepository from "./note.repository.js";

export const addNote = asyncHandler(async (req, res) => {
  const { tittle, content } = req.body; 
  const userId = req.user._id;

  const note = await noteRepository.createNote({
    tittle,
    content,
    userId,
  });

  return responseHandler(201, "Note Created Successfully", note, res);
});

export const editeNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { newTittle, newContent } = req.body;
  const userId = req.user._id;

  const existingNote = await noteRepository.findNoteById({ noteId });
  if (!existingNote) {
    return responseHandler(404, "Note doesn't exist.", null, res);
  }

  if (existingNote.userId.toString() !== userId.toString()) {
    return responseHandler(403, "Unauthorized to edit this note.", null, res);
  }

  const updateData = {};
  if (newTittle !== undefined) updateData.tittle = newTittle;
  if (newContent !== undefined) updateData.content = newContent;

  const updatedNote = await noteRepository.findNoteByIdAndUpdate(
    noteId,
    updateData,
  );

  return responseHandler(200, "Note updated successfully.", updatedNote, res);
});

export const removeNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const userId = req.user._id;

  const existingNote = await noteRepository.findNoteById({ noteId });
  if (!existingNote) {
    return responseHandler(404, "Note doesn't exist.", null, res);
  }

  if (existingNote.userId.toString() !== userId.toString()) {
    return responseHandler(403, "Unauthorized to delete this note.", null, res);
  }

  const deletedNote = await noteRepository.findNoteByIdAndDelete(noteId);
  return responseHandler(200, "Note deleted successfully.", deletedNote, res);
});

export const getNotes = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notes = await noteRepository.findNotes({ userId });

  return responseHandler(200, "Notes fetched successfully.", notes || [], res);
});
