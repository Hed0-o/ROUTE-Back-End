import Joi from "joi";
import { required } from "zod/mini";

export const addNoteSchema = {
  body: Joi.object({
    tittle: Joi.string()
      .min(5)
      .max(30)
      .regex(/^[A-Za-z0-9 ]+$/)
      .custom((value, helpers) => {
        if (value === value.toUpperCase()) {
          return helpers.message("Title cannot be entirely uppercase");
        }
        return value;
      })
      .required(),
    content: Joi.string().min(15).max(200).required(),
  }),
};

export const deleteNoteSchema = {
  params: Joi.object({
    noteId: Joi.string().hex().length(24).required(),
  }).required(),
};

export const UpdateNoteSchema = {
  body: Joi.object({
    newTittle: Joi.string()
      .min(5)
      .max(30)
      .regex(/^[A-Za-z0-9 ]+$/)
      .custom((value, helpers) => {
        if (value === value.toUpperCase()) {
          return helpers.message("Title cannot be entirely uppercase");
        }
        return value;
      }),
    newContent: Joi.string().min(15).max(200),
  })
    .required()
    .min(1),
  params: Joi.object({
    noteId: Joi.string().hex().length(24).required(),
  }).required(),
};
