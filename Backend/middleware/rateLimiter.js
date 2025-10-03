import { getConfigForApi } from "../Utils/configUtils.js";
import rateLimiter from "express-rate-limit";
const limiterCache = new Map();

const limiter = async (req, res, next) => {
  const config = await getConfigForApi(req.originalUrl);
  if (!config || !config.limitEnabled) return next();

  const cacheKey = req.originalUrl;
  if (!limiterCache.has(cacheKey)) {
    let unitMs = config.rateUnit === "second" ? 1000 : 60000;
    const windowMs = config.rate * unitMs;

  
    const middleware = rateLimiter({
      windowMs,
      max: config.maxRequests,
      message: "Too many requests, please try again later.",
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: (req) => req.headers["x-forwarded-for"] || req.ip,
    });

    limiterCache.set(cacheKey, middleware);
    console.log(
      `[RateLimiter] Initialized for ${cacheKey} → ${config.maxRequests} req / ${config.rate} ${config.rateUnit}`
    );
  }

  return limiterCache.get(cacheKey)(req, res, next);
};

export default limiter;
