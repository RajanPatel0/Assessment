import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redis = null;

try {
  redis = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: null,
    retryStrategy(times) {
      if (times > 5) return null; // stop retrying
      return Math.min(times * 200, 2000);
    },
    enableReadyCheck: false,
    tls: {} // REQUIRED for Upstash
  });

  redis.on("connect", () => {
    console.log("Redis Connected (Upstash)");
  });

  redis.on("error", (err) => {
    console.log("Redis Error → cache disabled:", err.message);
    redis.disconnect();
    redis = null;
  });

  await redis.connect();

} catch (err) {
  console.log("Redis init failed → running without cache");
  redis = null;
}

export const setCache = async (key, value, ttl = 600) => {
  if (!redis) return false;
  try {
    await redis.set(key, JSON.stringify(value), "EX", ttl);
    return true;
  } catch {
    return false;
  }
};

export const getCache = async (key) => {
  if (!redis) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const deleteCache = async (key) => {
  if (!redis) return false;
  try {
    await redis.del(key);
    return true;
  } catch {
    return false;
  }
};


export default redis;