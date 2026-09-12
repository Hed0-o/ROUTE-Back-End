import Joi from "joi";

export const signUpSchema = {
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/webp")
      .required(),
    size: Joi.number().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }).required(),
  body: Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .regex(/^[A-Za-z](?: ?[A-Za-z]){2,49}$/)
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .required(),
    phone: Joi.string()
      .regex(/^(?:\+201|01)\d{9}$/)
      .required(),
    age: Joi.number().integer().min(18).max(60).required(),
    gender: Joi.string().valid("male", "female").required(),
    role: Joi.string().valid("client", "admin").default("client"),
  }).required(),
};

export const logInSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).required(),
};

export const verifyEmailSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string()
      .regex(/^[0-9]{6}$/)
      .required(),
  }).required(),
};

export const deleteUserSchema = {
  params: Joi.object({
    userId: Joi.string().hex().length(24).required(),
  }).required(),
};

export const editClientUserSchema = {
  body: Joi.object({
    newName: Joi.string()
      .min(3)
      .max(50)
      .regex(/^[A-Za-z](?: ?[A-Za-z]){2,49}$/),
    newEmail: Joi.string().email(),
    newPhone: Joi.string().regex(/^(?:\+201|01)\d{9}$/),
  })
    .required()
    .min(1),
};

export const refreshTokenSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }).required(),
};
