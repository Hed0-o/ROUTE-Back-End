import * as userQuery from "../user/user.repository.js";
import encrypt from "../../common/security/encrypt.js";
import hash, { compare } from "../../common/security/hash.js";
import { generateToken } from "../../common/utils/jwt.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(
  "263550067976-s01popthpu0h19ddehqt52fvjk05hi2e.apps.googleusercontent.com",
);

export const signUpUser = async (req, res) => {
  const { name, email, password, phone, age } = req.body;
  const img = req.file.filename;
  const existingUser = await userQuery.findUser({ email });
  if (existingUser) {
    return res.status(409).json({
      message: "Email already exists, cannot create user.",
    });
  }
  const user = await userQuery.createUser({
    name,
    email,
    password: await hash(password),
    phone: encrypt(phone),
    age,
    img,
  });
  return res.status(201).json({
    message: "done",
    user,
  });
};

export const logInUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await userQuery.findUser({ email });
  if (!existingUser) {
    return res.status(404).json({
      message: "User does not exist.",
    });
  }
  const isCorrectPassword = await compare(password, existingUser.password);
  if (!isCorrectPassword) {
    return res.status(400).json({
      message: "Incorrect password.",
    });
  }
  const token = generateToken(existingUser._id);
  return res.status(200).json({
    message: "User logged in successfully.",
    token,
  });
};

export const googleAuth = async (req, res) => {
  const { idToken } = req.body;
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const googleUserData = {
    name: payload.name,
    email: payload.email,
    googleId: payload.sub,
    authProvider: "google",
  };
  const user = await userQuery.createUser(googleUserData);
};

export const updateUser = async (req, res) => {
  const userId = req.userId;
  const { newEmail, newName, newPhone, newAge } = req.body;
  if (newEmail) {
    const existingUser = await userQuery.findUser({
      email: newEmail,
    });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      return res.status(400).json({
        message: "Email already in use by another account.",
      });
    }
  }
  const user = await userQuery.findByIdAndUpdate(
    userId,
    {
      ...(newEmail !== undefined && {
        email: newEmail,
      }),
      ...(newName !== undefined && {
        name: newName,
      }),
      ...(newPhone !== undefined && {
        phone: encrypt(newPhone),
      }),
      ...(newAge !== undefined && {
        age: newAge,
      }),
    },
    {
      returnDocument: "after",
    },
  );
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }
  return res.status(200).json({
    message: "User profile updated successfully.",
    user,
  });
};

export const deleteUser = async (req, res) => {
  const userId = req.userId;
  const user = await userQuery.findByIdAndDelete(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }
  return res.status(200).json({
    message: "User account deleted successfully.",
  });
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  const user = await userQuery.findUserById(userId);
  if (!user) {
    return res.status(404).json({
      message: "User not found.",
    });
  }
  return res.status(200).json({
    message: "User profile retrieved successfully.",
    user,
  });
};
