import { createClient } from "redis";
import * as config from "../../config/config.service.js";

export const client = createClient({
  username: config.REDIS_USERNAME,
  password: config.REDIS_PASS,
  socket: {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  },
});

export const redisConnectionStatus = async () => {
  try {
    await client.connect();
    console.log("Successfully connected to RedisDB.");
  } catch (error) {
    console.log("Can't connect to DB.", error);
  }
};
