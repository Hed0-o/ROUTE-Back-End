import joi from "joi";

export const signUpSchema = {
  body: joi
    .object({
      name: joi.string().min(3).max(20).required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
      phone: joi
        .string()
        .pattern(/^(\+20)?1[0125]\d{8}$/)
        .required(),
      age: joi.number().min(18).max(60),
    })
    .required(),
};

export const logInSchema = {
  body: joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    })
    .required(),
};

export const updateUserSchema = {
  body: joi
    .object({
      newName: joi.string().min(3).max(20),
      newEmail: joi.string().email(),
      newPhone: joi.string().pattern(/^(\+20)?1[0125]\d{8}$/),
      newAge: joi.number().min(18).max(60),
    })
    .min(1)
    .required(),
};

export const imageSchema = {
  file: joi
    .object({
      fieldname: joi.string().valid("img").required(),
      mimetype: joi
        .string()
        .valid("image/jpeg", "image/png", "image/webp")
        .required(),
      size: joi
        .number()
        .max(5 * 1024 * 1024)
        .required(),
    })
    .unknown(true)
    .required(),
};
