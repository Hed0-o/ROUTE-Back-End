const responseHandler = (statusCode, message, data, res) => {
  const isSuccess = statusCode >= 200 && statusCode < 300;

  return res.status(statusCode).json({
    success: isSuccess,
    message,
    data,
  });
};
export default responseHandler;
