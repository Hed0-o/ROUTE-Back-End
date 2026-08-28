import joi from "joi";

export const addNoteSchema = {
  body: joi
    .object({
      title: joi.string().min(10).max(30).required(),
      content: joi.string().min(10).max(200).required(),
    })
    .required(),
};

export const update_replace_NoteSchema = {
  body: joi
    .object({
      title: joi.string().min(10).max(30).required(),
      content: joi.string().min(10).max(200).required(),
    })
    .required(),
  params: joi
    .object({
      noteId: joi.string().required(),
    })
    .min(1)
    .required(),
};

export const updateAllNotesTitleSchema = {
  body: joi
    .object({
      title: joi.string().min(10).max(30).required(),
    })
    .required(),
};
