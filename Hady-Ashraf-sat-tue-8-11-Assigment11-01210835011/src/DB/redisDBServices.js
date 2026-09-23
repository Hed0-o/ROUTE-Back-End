import { client as redisClient } from "../DB/connectionRedisDB.js";

export const setCache = async (key, value, ttlInSeconds = null) => {
  const formattedValue =
    typeof value === "object" ? JSON.stringify(value) : value;
  if (ttlInSeconds) {
    return await redisClient.set(key, formattedValue, { EX: ttlInSeconds });
  }
  return await redisClient.set(key, formattedValue);
};
export const getCache = async (key) => {
  const data = await redisClient.get(key);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
};
export const deleteCache = async (key) => {
  return await redisClient.del(key);
};

export const hasKey = async (key) => {
  const count = await redisClient.exists(key);
  return count > 0;
};
export const incrementKey = async (key) => {
  return await redisClient.incr(key);
};
export const setExpiration = async (key, seconds) => {
  return await redisClient.expire(key, seconds);
};
export const setHashField = async (key, field, value) => {
  const formattedValue =
    typeof value === "object" ? JSON.stringify(value) : value;
  return await redisClient.hSet(key, field, formattedValue);
};
export const getHashAll = async (key) => {
  return await redisClient.hGetAll(key);
};
