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
  const filePath = req.file?.path;

  try {
    const { name, email, password, phone, age, gender, role } = req.body;

    const otpRateKey = `auth:otp_rate:${email}`;
    const requestCount = await redisServices.incrementKey(otpRateKey);

    if (requestCount === 1) {
      await redisServices.setExpiration(otpRateKey, 60 * 3);
    }

    if (requestCount > 3) {
      if (filePath) await deleteFile(filePath);
      return responseHandler(
        429,
        "Too many verification requests. Please try again after 3 minutes.",
        null,
        res,
      );
    }

    const existingUser = await userRepository.findUser({ email });
    if (existingUser) {
      if (filePath) await deleteFile(filePath);
      return responseHandler(409, "Email already exists.", null, res);
    }

    const verificationOtp = Math.floor(100000 + Math.random() * 900000);
    const hashedOtp = await hash(verificationOtp.toString());

    await redisServices.setCache(`auth:otp:${email}`, hashedOtp, 60 * 3);

    await sendingEmailFormula(
      email,
      "Verify Your Email",
      "Please click the button to verify your email.",
      postVerificationTemplate(verificationOtp, "3 minutes", name),
    );

    const user = await userRepository.createUser({
      name,
      email,
      password: await hash(password),
      phone: await encrypt(phone),
      age,
      gender,
      role,
      img: filePath,
    });

    return responseHandler(
      201,
      "User created successfully. Please verify your email.",
      user,
      res,
    );
  } catch (error) {
    if (filePath) await deleteFile(filePath);
    throw error;
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const existingUser = await userRepository.findUser({ email });
  if (!existingUser) {
    return responseHandler(404, "Email doesn't exist.", null, res);
  }

  if (existingUser.isVerified) {
    return responseHandler(400, "Your account is already verified.", null, res);
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

  const failedAttemptsKey = `auth:otp_failed:${email}`;
  const isCorrectOtp = await compare(otp.toString(), cachedOtp);

  if (!isCorrectOtp) {
    const failedCount = await redisServices.incrementKey(failedAttemptsKey);

    if (failedCount === 1) {
      await redisServices.setExpiration(failedAttemptsKey, 60 * 3);
    }

    if (failedCount >= 5) {
      await redisServices.deleteCache(`auth:otp:${email}`);
      await redisServices.deleteCache(failedAttemptsKey);

      return responseHandler(
        429,
        "Too many incorrect attempts. Your verification code has been invalidated. Please request a new one.",
        null,
        res,
      );
    }

    return responseHandler(
      400,
      `Incorrect code. You have ${5 - failedCount} attempt(s) remaining.`,
      null,
      res,
    );
  }

  await redisServices.deleteCache(`auth:otp:${email}`);
  await redisServices.deleteCache(failedAttemptsKey);

  existingUser.isVerified = true;
  await existingUser.save();

  return responseHandler(200, "Successfully verified email.", null, res);
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

  if (!existingUser.isVerified) {
    return responseHandler(
      401,
      "Your account isn't verified. Verify your account to continue.",
      null,
      res,
    );
  }

  const sessionId = crypto.randomUUID();
  const accessToken = generateAcessToken(existingUser._id, sessionId);
  const refreshToken = generateRefreshToken(existingUser._id, sessionId);

  await sessionRepository.createSession({
    userId: existingUser._id,
    sessionId,
    refreshToken,
    device: req.headers["user-agent"] || "unknown",
  });

  return responseHandler(
    200,
    "User logged in successfully.",
    { accessToken, refreshToken },
    res,
  );
});

export const resendVerificationOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return responseHandler(400, "Email is required.", null, res);
  }

  const existingUser = await userRepository.findUser({ email });
  if (!existingUser) {
    return responseHandler(404, "Email doesn't exist.", null, res);
  }

  if (existingUser.isVerified) {
    return responseHandler(400, "Your account is already verified.", null, res);
  }

  const otpRateKey = `auth:otp_rate:${email}`;
  const requestCount = await redisServices.incrementKey(otpRateKey);

  if (requestCount === 1) {
    await redisServices.setExpiration(otpRateKey, 60 * 3);
  }

  if (requestCount > 3) {
    return responseHandler(
      429,
      "Too many OTP requests. Please wait 3 minutes before trying again.",
      null,
      res,
    );
  }

  const newVerificationOtp = Math.floor(100000 + Math.random() * 900000);
  const hashedOtp = await hash(newVerificationOtp.toString());

  await redisServices.setCache(`auth:otp:${email}`, hashedOtp, 60 * 3);

  await redisServices.deleteCache(`auth:otp_failed:${email}`);

  await sendingEmailFormula(
    email,
    "Verify Your Email - New Code",
    "Please use the code below to verify your email.",
    postVerificationTemplate(
      newVerificationOtp,
      "3 minutes",
      existingUser.name,
    ),
  );

  return responseHandler(
    200,
    "A new verification code has been sent to your email.",
    null,
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

    if (!session || session.refreshToken !== refreshToken) {
      return responseHandler(
        401,
        "Session is invalid or expired. Please login again.",
        null,
        res,
      );
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

  await sessionRepository.deleteSession({ userId, sessionId });

  return responseHandler(200, "User logged out successfully.", null, res);
});

export const removeUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const existingUser = await userRepository.findUserById(userId);
  if (!existingUser) {
    return responseHandler(404, "User doesn't exist.", null, res);
  }

  if (existingUser.img) {
    await deleteFile(existingUser.img);
  }

  const deletedUser = await userRepository.findUserByIdAndDelete(userId);
  return responseHandler(200, "User deleted successfully.", deletedUser, res);
});

export const editUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { newName, newEmail, newPhone } = req.body;

  const existingUser = await userRepository.findUserById(userId);
  if (!existingUser) {
    return responseHandler(404, "User doesn't exist.", null, res);
  }

  const updateData = {};
  if (newName !== undefined) updateData.name = newName;
  if (newEmail !== undefined) updateData.email = newEmail;
  if (newPhone !== undefined) updateData.phone = await encrypt(newPhone);

  const updatedUser = await userRepository.findUserByIdAndUpdate(
    userId,
    updateData,
  );

  return responseHandler(200, "User updated successfully.", updatedUser, res);
});
