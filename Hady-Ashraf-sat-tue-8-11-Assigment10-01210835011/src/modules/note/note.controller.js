import { Router } from "express";
import * as noteService from "./note.service.js";
import authenticate from "../../common/middlewares/authentication.js";
import validate from "../../common/middlewares/validation.js";
import * as noteValidation from "./note.validation.js";

const router = Router();

router.post(
  "/add",
  authenticate,
  validate(noteValidation.addNoteSchema),
  noteService.addNote,
);

router.patch(
  "/update/:noteId",
  authenticate,
  validate(noteValidation.UpdateNoteSchema),
  noteService.editeNote,
);

router.get("/get", authenticate, noteService.getNotes);

router.delete(
  "/delete/:noteId",
  authenticate,
  validate(noteValidation.deleteNoteSchema),
  noteService.removeNote,
);

export default router;
