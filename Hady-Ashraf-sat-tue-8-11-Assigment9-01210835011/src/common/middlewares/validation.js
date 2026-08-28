// validate.js

const validate = (schema) => {
  return async (req, res, next) => {
    let errorDetails = [];
    for (const key of Object.keys(schema)) {
      const { error } = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (error) {
        error.details.forEach((element) => {
          errorDetails.push({
            key,
            path: element.path[0],
            message: element.message,
          });
        });
      }
    }
    if (errorDetails.length) {
      return res.status(400).json({
        message: "Validation error",
        error: errorDetails,
      });
    }
    next();
  };
};

export default validate;
