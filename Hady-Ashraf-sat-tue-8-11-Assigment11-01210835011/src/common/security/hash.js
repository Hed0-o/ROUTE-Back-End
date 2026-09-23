import bcrypt from "bcrypt";
import * as config from "../../../config/config.service.js";

const SALT_ROUNDS = config.SALT_ROUNDS;

export const hash = async (text) => {
  return await bcrypt.hash(text, SALT_ROUNDS);
};

export const compare = async (text, hashedText) => {
  return await bcrypt.compare(text, hashedText);
};
