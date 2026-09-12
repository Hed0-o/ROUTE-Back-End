import jwt from "jsonwebtoken";

export const generateAcessToken = (userId, sessionId) => {
  return jwt.sign(
    {
      userId,
      sessionId,
    },
    "A_SEC_KE_A",
    {
      expiresIn: "1h",
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
    "R_SEC_KE_R",
    {
      expiresIn: "7d",
    },
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, "A_SEC_KE_A");
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, "R_SEC_KE_R");
};
