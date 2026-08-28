import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, "X_SEC_KE_X", { expiresIn: "1h" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, "X_SEC_KE_X");
};
