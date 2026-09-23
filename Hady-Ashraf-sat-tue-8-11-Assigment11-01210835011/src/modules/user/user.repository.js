import User from "../../DB/models/user.model.js";
import * as db from "../../common/services/base.repository.js";

export const createUser = (data) => {
  return db.create(User, data);
};

export const findUser = (data) => {
  return db.findOne(User, data);
};

export const findUserById = ({ userId }) => {
  return db.findById(User, userId);
};

export const findUserByIdAndDelete = ({ userId }) => {
  return db.findByIdAndDelete(User, userId);
};

export const findUserByIdAndUpdate = (userId, updateData) => {
  return db.findByIdAndUpdate(User, userId, updateData);
};
