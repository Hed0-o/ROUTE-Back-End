import mongoose from "mongoose";
import User from "../../DB/models/user.model.js";

export const createUser = (data) => {
  return User.create(data);
};

export const findUser = (data) => {
  return User.findOne(data);
};

export const findUserById = (data) => {
  return User.findById(data);
};

export const findByIdAndUpdate = async (id, updateData, options) => {
  return User.findByIdAndUpdate(id, updateData, options);
};

export const findByIdAndDelete = (data) => {
  return User.findByIdAndDelete(data);
};
