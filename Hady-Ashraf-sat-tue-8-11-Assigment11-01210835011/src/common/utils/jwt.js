import jwt from "jsonwebtoken";
import * as config from "../../../config/config.service.js";

export const generateAcessToken = (userId, sessionId) => {
  return jwt.sign(
    {
      userId,
      sessionId,
    },
    config.ACCESS_KEY,
    {
      expiresIn: config.ACCESS_EX,
    },
  );
};

export const generateRefreshToken = (user, sessionId) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      sessionId,
    },
    config.REFRESH_KEY,
    {
      expiresIn: config.REFRESH_EX,
    },
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.ACCESS_KEY);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.REFRESH_KEY);
};
