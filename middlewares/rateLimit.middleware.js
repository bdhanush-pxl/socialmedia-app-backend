import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { connectRedis, getRedisClient } from "../config/redis.js";

const createLimiter = ({ windowMs, limit, message }) => {
    const redisClient = getRedisClient();
    const options = {
        windowMs,
        limit,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        passOnStoreError: true,
        message: { success: false, message },
    };

    if (redisClient) {
        options.store = new RedisStore({
            sendCommand: async (...args) => {
                await connectRedis();
                return redisClient.sendCommand(args);
            },
        });
    }

    return rateLimit(options);
};

const apiLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    message: "Too many requests, please try again later",
});

const authLimiter = createLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: "Too many authentication attempts, please try again later",
});

const messageLimiter = createLimiter({
    windowMs: 60 * 1000,
    limit: 60,
    message: "Too many messages, please try again later",
});

export { apiLimiter, authLimiter, messageLimiter };
