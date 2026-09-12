import * as redisServices from "../../DB/redisDBServices.js";
import asyncHandler from "../../common/middlewares/asyncHandler.js";
import encrypt from "../../common/security/encrypt.js";
import * as userRepository from "./user.repository.js";
import * as sessionRepository from "../session/session.repository.js";
import { compare, hash } from "../../common/security/hash.js";
import {
  generateAcessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.js";
import responseHandler from "../../common/utils/responseHandler.js";
import deleteFile from "../../common/utils/deleteFile.js";
import {
  postVerificationTemplate,
  sendingEmailFormula,
} from "../../common/services/nodemailer.js";
import crypto from "crypto";

export const signUp = asyncHandler(async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, role } = req.body;
    const img = req.file.path;
    const existingUser = await userRepository.findUser({
      email,
    });
    if (existingUser) {
      await deleteFile(req.file.path);
      return responseHandler(409, "Email already exist.", null, res);
    }
    const VerificationOtp = Math.floor(Math.random() * 1000000);
    await redisServices.setCache(
      `auth:otp:${email}`,
      await hash(VerificationOtp.toString()),
      60 * 3,
    );

    await sendingEmailFormula(
      email,
      "Verify Your Email",
      "please click the button to verify your email. ",
      postVerificationTemplate(VerificationOtp, "3 minutes", name),
    );
    const user = await userRepository.createUser({
      name,
      email,
      password: await hash(password),
      phone: await encrypt(phone),
      age,
      gender,
      role,
      img,
    });
    return responseHandler(201, "User created successfully.", user, res);
  } catch (error) {
    await deleteFile(req.file?.path);
    throw error;
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const existingUser = await userRepository.findUser({ email });
  if (!existingUser) {
    return responseHandler(401, "Email doesn't exist.", null, res);
  }
  if (existingUser.isVerified) {
    return responseHandler(401, "Your account is already verified.", null, res);
  }
  const cachedOtp = await redisServices.getCache(`auth:otp:${email}`);
  if (!cachedOtp) {
    return responseHandler(
      400,
      "Verification code has expired or doesn't exist.",
      null,
      res,
    );
  }
  const isCorrectOtp = await compare(otp, cachedOtp);
  if (!isCorrectOtp) {
    return responseHandler(
      400,
      "Incorrect code, Please reenter the valid code.",
      null,
      res,
    );
  }
  await redisServices.deleteCache(`auth:otp:${email}`);
  existingUser.isVerified = true;
  await existingUser.save();
  return responseHandler(200, "Successfully verifying email.", null, res);
});

export const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await userRepository.findUser({ email });
  if (!existingUser) {
    return responseHandler(401, "Invalid email or password.", null, res);
  }
  const isCorrectPassword = await compare(password, existingUser.password);
  if (!isCorrectPassword) {
    return responseHandler(401, "Invalid email or password.", null, res);
  }
  if (existingUser.isVerified === false) {
    return responseHandler(
      401,
      "Your account isn't verified, Verify your account to continue.",
      null,
      res,
    );
  }
  const sessionId = crypto.randomUUID();
  const accessToken = generateAcessToken(existingUser._id, sessionId);
  const refreshToken = generateRefreshToken(existingUser, sessionId);
  await sessionRepository.createSession({
    userId: existingUser._id,
    sessionId,
    refreshToken,
    device: req.headers["user-agent"] || "unknown",
  });
  return responseHandler(
    200,
    "User logged in successfully.",
    {
      accessToken,
      refreshToken,
    },
    res,
  );
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return responseHandler(401, "Refresh token is required.", null, res);
  }
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const session = await sessionRepository.findSession({
      userId: decoded.userId,
      sessionId: decoded.sessionId,
    });
    if (!session) {
      return responseHandler(
        401,
        "Session is invalid or logged out. Please login again.",
        null,
        res,
      );
    }
    if (session.refreshToken !== refreshToken) {
      return responseHandler(401, "Invalid refresh token.", null, res);
    }
    const newAccessToken = generateAcessToken(
      decoded.userId,
      decoded.sessionId,
    );
    return responseHandler(
      200,
      "Access token refreshed successfully.",
      { newAccessToken },
      res,
    );
  } catch (error) {
    return responseHandler(
      403,
      "Invalid or expired refresh token. Please login again.",
      null,
      res,
    );
  }
});

export const logOut = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const sessionId = req.user.sessionId;
  const token = req.token;
  const decodedToken = verifyAccessToken(token);
  const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);
  if (expiresIn > 0) {
    await redisServices.setCache(`blacklist:${token}`, "revoked", expiresIn);
  }
  const result = await sessionRepository.deleteSession({
    userId,
    sessionId,
  });
  return responseHandler(200, "User logged out successfully.", null, res);
});

export const removeUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const existingUser = await userRepository.findUserById({ userId });
  if (!existingUser) {
    return responseHandler(404, "User doesn't exist.", null, res);
  }
  const deletedUser = await userRepository.findUserByIdAndDelete({ userId });
  return responseHandler(200, "User deleted successfully.", deletedUser, res);
});

export const editUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { newName, newEmail, newPhone } = req.body;
  const existingUser = await userRepository.findUserById({ userId });
  if (!existingUser) {
    return responseHandler(404, "User doesn't exist.", null, res);
  }
  const updatedUser = await userRepository.findUserByIdAndUpdate(userId, {
    ...(newName !== undefined && { name: newName }),
    ...(newEmail !== undefined && { email: newEmail }),
    ...(newPhone !== undefined && {
      phone: await encrypt(newPhone),
    }),
  });
  return responseHandler(200, "User updated successfully.", updatedUser, res);
});
