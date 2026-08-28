import { verifyToken } from "../utils/jwt.js";

const authentication = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      message: "Token is required.",
    });
  }
  const token = authorization.split(" ")[1];
  const decoded = verifyToken(token);
  req.userId = decoded.userId;
  next();
};

export default authentication;
