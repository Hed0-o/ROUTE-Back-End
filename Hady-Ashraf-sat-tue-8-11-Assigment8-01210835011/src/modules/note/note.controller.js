import Router from "express";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import * as noteService from "./note.service.js";
import authenticate from "../../common/middlewares/auth.middleware.js";

const router = Router();

router.post("/create", authenticate, asyncHandler(noteService.addNote));
router.patch(
  "/all",
  authenticate,
  asyncHandler(noteService.updateAllNotesTitle),
);
router.get(
  "/paginate-sort",
  authenticate,
  asyncHandler(noteService.getPaginatedNotes),
);
router.get(
  "/note-by-content",
  authenticate,
  asyncHandler(noteService.getNoteByContent),
);
router.get(
  "/note-with-user",
  authenticate,
  asyncHandler(noteService.getNotesWithUser),
);
router.get(
  "/aggregate",
  authenticate,
  asyncHandler(noteService.getAggregatedNotes),
);
router.delete("/", authenticate, asyncHandler(noteService.deleteAllNotes));
router.patch(
  "/update/:noteId",
  authenticate,
  asyncHandler(noteService.updateNote),
);
router.put(
  "/replace/:noteId",
  authenticate,
  asyncHandler(noteService.replaceNote),
);
router.delete("/:noteId", authenticate, asyncHandler(noteService.deleteNote));
router.get("/:id", authenticate, asyncHandler(noteService.getNote));

export default router;
