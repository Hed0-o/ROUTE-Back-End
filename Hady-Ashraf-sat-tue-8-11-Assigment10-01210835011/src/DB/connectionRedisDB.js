import { createClient } from "redis";

export const client = createClient({
  username: "default",
  password: "lP01hgOYoPpF83N2M0xS7YyyyqZvTNt1",
  socket: {
    host: "potato-country-garlanded-95105.db.redis.io",
    port: 16242,
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
