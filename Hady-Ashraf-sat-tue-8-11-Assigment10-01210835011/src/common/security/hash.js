import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const hash = async (text) => {
  return await bcrypt.hash(text, SALT_ROUNDS);
};

export const compare = async (text, hashedText) => {
  return await bcrypt.compare(text, hashedText);
};
