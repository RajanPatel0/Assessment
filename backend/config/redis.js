import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redis = null;

// Only try to connect if REDIS_URL is provided
if (process.env.REDIS_URL && process.env.REDIS_URL !== 'undefined') {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
      retryStrategy(times) {
        if (times > 3) return null; // reduce retries in production
        return Math.min(times * 200, 1000);
      },
      enableReadyCheck: false,
      tls: process.env.NODE_ENV === 'production' ? {} : undefined // TLS for production
    });

    redis.on("connect", () => {
      console.log("✅ Redis Connected Successfully");
    });

    redis.on("error", (err) => {
      console.log("⚠️ Redis Error → cache disabled:", err.message);
      redis = null;
    });

    // Don't await connect here, let it happen in background
    redis.connect().catch(() => {
      redis = null;
    });

  } catch (err) {
    console.log("⚠️ Redis init failed → running without cache");
    redis = null;
  }
} else {
  console.log("⚠️ No Redis URL provided → running without cache");
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

export const deleteCachePattern = async (pattern) => {
  if (!redis) return false;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(keys);
    }
    return true;
  } catch {
    return false;
  }
};

export default redis;