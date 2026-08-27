import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const redisUrl = process.env.REDIS_URL;
const cacheTtl = Number.parseInt(process.env.REDIS_CACHE_TTL || "60", 10);
const redisClient = redisUrl ? createClient({ url: redisUrl }) : null;
let connectionPromise;

if (redisClient) {
    redisClient.on("error", (error) => {
        console.error("Redis error:", error.message);
    });
}

const connectRedis = async () => {
    if (!redisClient) {
        return false;
    }
    if (redisClient.isReady) {
        return true;
    }
    if (!connectionPromise) {
        connectionPromise = redisClient.connect().catch((error) => {
            connectionPromise = undefined;
            console.error("Redis connection failed:", error.message);
            return false;
        });
    }
    return connectionPromise;
};

const getCached = async (key) => {
    if (!(await connectRedis())) {
        return null;
    }
    try {
        const value = await redisClient.get(key);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error("Redis read failed:", error.message);
        return null;
    }
};

const setCached = async (key, value, ttl = cacheTtl) => {
    if (!(await connectRedis())) {
        return;
    }
    try {
        await redisClient.set(key, JSON.stringify(value), { EX: ttl });
    } catch (error) {
        console.error("Redis write failed:", error.message);
    }
};

const invalidatePostCache = async (postId) => {
    if (!(await connectRedis())) {
        return;
    }
    try {
        const keys = [postId ? `posts:${postId}` : null].filter(Boolean);
        for await (const key of redisClient.scanIterator({ MATCH: "posts:list:*", COUNT: 100 })) {
            keys.push(key);
        }
        if (keys.length > 0) {
            await redisClient.del(keys);
        }
    } catch (error) {
        console.error("Redis invalidation failed:", error.message);
    }
};

const getRedisClient = () => redisClient;

export { connectRedis, getRedisClient, getCached, setCached, invalidatePostCache };
