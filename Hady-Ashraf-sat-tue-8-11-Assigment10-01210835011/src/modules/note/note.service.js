import asyncHandler from "../../common/middlewares/asyncHandler.js";
import responseHandler from "../../common/utils/responseHandler.js";
import * as noteRrpository from "./note.repository.js";

export const addNote = asyncHandler(async (req, res) => {
  const { tittle, content } = req.body;
  const userId = req.user._id;
  const note = await noteRrpository.createNote({
    tittle,
    content,
    userId,
  });
  return responseHandler(201, "Note Created Successfully", note, res);
});

export const editeNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const { newTittle, newContent } = req.body;
  const exsistingNote = await noteRrpository.findNoteById({ noteId });
  if (!exsistingNote) {
    return responseHandler(404, " Note doesn't exist.", null, res);
  }
  const updatedNote = await noteRrpository.findNoteByIdAndUpdate({
    noteId,
    ...(newTittle !== undefined && { tittle: newTittle }),
    ...(newContent !== undefined && { content: newContent }),
  });
  return responseHandler(200, "Note updated Sucessfully. ", updatedNote, res);
});

export const removeNote = asyncHandler(async (req, res) => {
  const { noteId } = req.params;
  const exsistingNote = await noteRrpository.findNoteById({ noteId });
  if (!exsistingNote) {
    return responseHandler(404, " Note doesn't exist.", null, res);
  }
  const deletedNote = await noteRrpository.findNoteByIdAndDelete({ noteId });
  return responseHandler(200, "Note Deleted Sucessfully. ", deletedNote, res);
});

export const getNotes = asyncHandler(async (req, res) => {
  const { userId } = req.user._id;
  const notes = await noteRrpository.findNotes(userId);
  if (!notes) {
    return;
  }
  return responseHandler(200, "All Notes ", notes, res);
});
