import Router from "express";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import authentication from "../../common/middlewares/authentication.js";
import validate from "../../common/middlewares/validation.js";
import * as noteValidation from "../../modules/note/note.validation.js";
import * as noteService from "./note.service.js";

const router = Router();

router.post(
  "/create",
  authentication,
  validate(noteValidation.addNoteSchema),
  asyncHandler(noteService.addNote),
);

router.patch(
  "/update/:noteId",
  authentication,
  validate(noteValidation.update_replace_NoteSchema),
  asyncHandler(noteService.updateNote),
);

router.put(
  "/replace/:noteId",
  authentication,
  validate(noteValidation.update_replace_NoteSchema),
  asyncHandler(noteService.replaceNote),
);

router.patch(
  "/all",
  authentication,
  validate(noteValidation.updateAllNotesTitleSchema),
  asyncHandler(noteService.updateAllNotesTitle),
);

router.get(
  "/paginate-sort",
  authentication,
  asyncHandler(noteService.getPaginatedNotes),
);

router.get(
  "/note-by-content",
  authentication,
  asyncHandler(noteService.getNoteByContent),
);

router.get(
  "/note-with-user",
  authentication,
  asyncHandler(noteService.getNotesWithUser),
);

router.get(
  "/aggregate",
  authentication,
  asyncHandler(noteService.getAggregatedNotes),
);

router.delete("/", authentication, asyncHandler(noteService.deleteAllNotes));

router.delete(
  "/:noteId",
  authentication,
  validate(noteValidation.deleteNoteSchema),
  asyncHandler(noteService.deleteNote),
);

router.get(
  "/:noteId",
  authentication,
  validate(noteValidation.getNoteSchema),
  asyncHandler(noteService.getNote),
);

export default router;
