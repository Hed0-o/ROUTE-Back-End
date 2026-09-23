import deleteFile from "../utils/deleteFile.js";

const validate = (schema) => {
  return (req, res, next) => {
    const errors = [];
    if (schema.body) {
      const { error } = schema.body.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        errors.push(
          ...error.details.map((detail) => ({
            key: "body",
            path: detail.path.join("."),
            message: detail.message,
          })),
        );
      }
    }
    if (schema.file) {
      const { error } = schema.file.validate(req.file, {
        abortEarly: false,
      });
      if (error) {
        errors.push(
          ...error.details.map((detail) => ({
            key: "file",
            path: detail.path.join("."),
            message: detail.message,
          })),
        );
      }
    }
    if (errors.length > 0) {
      deleteFile(req.file?.path);
      return res.status(400).json({
        message: "Validation error",
        error: errors,
      });
    }
    next();
  };
};

export default validate;
