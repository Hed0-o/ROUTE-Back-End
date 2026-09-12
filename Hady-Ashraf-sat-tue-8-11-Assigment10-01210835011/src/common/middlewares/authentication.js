import { verifyAccessToken } from "../utils/jwt.js";
import asyncHandler from "./asyncHandler.js";
import * as userRepository from "../../modules/user/user.repository.js";
import { client as redisClient } from "../../DB/connectionRedisDB.js";

const authenticate = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      message: "Token is required or invalid format.",
    });
  }
  const token = authorization.split(" ")[1];
  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted) {
    return res
      .status(401)
      .json({ message: "Token is expired or revoked. Please login again." });
  }
  try {
    const decoded = verifyAccessToken(token);
    const user = await userRepository.findUser({ _id: decoded.userId });
    if (!user) {
      return res.status(401).json({
        message: "User doesn't exist.",
      });
    }

    req.user = user;
    req.user.sessionId = decoded.sessionId;
    req.token = token;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired." });
    }
    return res.status(401).json({ message: "Invalid token." });
  }
});
export default authenticate;
