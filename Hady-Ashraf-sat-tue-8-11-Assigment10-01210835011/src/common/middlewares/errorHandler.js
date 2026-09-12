const errorHandler = (error, req, res, nex) => {
  return res.status(500).json({ message: `Faild`, error: error.message });
};

export default errorHandler;
