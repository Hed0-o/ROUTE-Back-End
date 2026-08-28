import * as noteQuery from "../note/note.repository.js";

export const addNote = async (req, res) => {
  const userId = req.userId;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required.",
    });
  }
  const note = await noteQuery.createNote({
    title,
    content,
    userId,
  });
  return res.status(201).json({
    message: "Note created successfully.",
    note: {
      title: note.title,
      content: note.content,
    },
  });
};

export const updateNote = async (req, res) => {
  const userId = req.userId;
  const { noteId } = req.params;
  const { title, content } = req.body;
  if (!title && !content) {
    return res.status(400).json({
      message: "Provide title or content to update.",
    });
  }
  const existingNote = await noteQuery.findNoteById(noteId);
  if (!existingNote) {
    return res.status(404).json({
      message: "Note not found.",
    });
  }
  if (existingNote.userId.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "Not authorized.",
    });
  }
  const updatedNote = await noteQuery.findByIdAndUpdate(
    noteId,
    {
      ...(title && { title }),
      ...(content && { content }),
    },
    { returnDocument: "after" },
  );
  return res.status(200).json({
    message: "Note updated successfully.",
    note: {
      title: updatedNote.title,
      content: updatedNote.content,
      userId: updatedNote.userId,
    },
  });
};

export const replaceNote = async (req, res) => {
  const { noteId } = req.params;
  const userId = req.userId;
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required.",
    });
  }
  const existingNote = await noteQuery.findNoteById(noteId);
  if (!existingNote) {
    return res.status(404).json({
      message: "Note not found.",
    });
  }
  if (existingNote.userId.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "Not authorized.",
    });
  }
  const replacedNote = await noteQuery.replaceNote(noteId, {
    title,
    content,
    userId,
  });
  return res.status(200).json({
    message: "Note replaced successfully.",
    replacedNote,
  });
};

export const updateAllNotesTitle = async (req, res) => {
  const userId = req.userId;
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({
      message: "Title is required.",
    });
  }
  const result = await noteQuery.updateManyTitles(userId, title);
  return res.status(200).json({
    message: "All notes titles updated successfully.",
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
  });
};

export const deleteNote = async (req, res) => {
  const userId = req.userId;
  const { noteId } = req.params;
  const existingNote = await noteQuery.findNoteById(noteId);
  if (!existingNote) {
    return res.status(404).json({
      message: "Note not found.",
    });
  }
  if (existingNote.userId.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "You are not authorized to delete this note.",
    });
  }
  const deletedNote = await noteQuery.findByIdAndDelete(noteId);
  return res.status(200).json({
    message: "Note deleted successfully.",
    deletedNote,
  });
};

export const getPaginatedNotes = async (req, res) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const { notes, totalCount } = await noteQuery.findNotesPaginated({
    userId,
    skip,
    limit,
  });
  return res.status(200).json({
    message: "Done.",
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
    totalNotes: totalCount,
    notes,
  });
};

export const getNote = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const note = await noteQuery.findNoteById(id);
  if (!note) {
    return res.status(404).json({
      message: "Note not found.",
    });
  }
  if (note.userId.toString() !== userId.toString()) {
    return res.status(403).json({
      message: "You are not authorized to view this note.",
    });
  }
  return res.status(200).json({
    message: "Note retrieved successfully.",
    note,
  });
};

export const getNoteByContent = async (req, res) => {
  const userId = req.userId;
  const { content } = req.query;
  if (!content) {
    return res.status(400).json({
      message: "Content query parameter is required.",
    });
  }
  const notes = await noteQuery.findNotesByContent(userId, content);
  return res.status(200).json({
    message: "Notes retrieved successfully.",
    notes,
  });
};

export const getNotesWithUser = async (req, res) => {
  const userId = req.userId;
  const notes = await noteQuery.findNotesWithUser(userId);
  return res.status(200).json({
    message: "Notes retrieved successfully.",
    notes,
  });
};

export const getAggregatedNotes = async (req, res) => {
  const userId = req.userId;
  const { title } = req.query;
  const notes = await noteQuery.aggregateUserNotes(userId, title);
  return res.status(200).json({
    message: "Notes retrieved successfully.",
    notes,
  });
};

export const deleteAllNotes = async (req, res) => {
  const userId = req.userId;
  const result = await noteQuery.deleteAllUserNotes(userId);
  return res.status(200).json({
    message: "All notes deleted successfully.",
    deletedCount: result.deletedCount,
  });
};
