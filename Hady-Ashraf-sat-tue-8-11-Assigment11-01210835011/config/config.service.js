import dotenv from "dotenv";
import { resolve } from "node:path";

const NODE_ENV = process.env.NODE_ENV;

const envPaths = {
  development: ".env.development",
  production: ".env.production",
};

dotenv.config({ path: resolve(`config/${envPaths[NODE_ENV]}`) });

export const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

export const PORT = Number(process.env.PORT);

export const RANDOM_BYTES = Number(process.env.RANDOM_BYTES);

export const IV_LENGTH = Number(process.env.IV_LENGTH);

export const REDIS_PORT = Number(process.env.REDIS_PORT);

export const EMAIL_USER = process.env.EMAIL_USER;

export const EMAIL_PASS = process.env.EMAIL_PASS;

export const ACCESS_KEY = process.env.ACCESS_KEY;

export const REFRESH_KEY = process.env.REFRESH_KEY;

export const ACCESS_EX = process.env.ACCESS_EX;

export const REFRESH_EX = process.env.REFRESH_EX;

export const DB_URI = process.env.DB_URI;

export const REDIS_USERNAME = process.env.REDIS_USERNAME;

export const REDIS_PASS = process.env.REDIS_PASS;

export const REDIS_HOST = process.env.REDIS_HOST;
