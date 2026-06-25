const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // 10 attempts per window
    message: { error: "Too many attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
    ipv6Subnet: 56,
    keyGenerator: (req) => {
        // Key by IP + username combo so one user's failures
        // don't block others on the same IP (e.g. shared NAT, university network)
        const ip = req.ip;
        const username = req.body?.username || req.body?.email || "anonymous";
        return `${ip}:${username}`;
    },
});

const usernameLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    keyGenerator: (req) => {
        return req.body?.username || req.body?.email || "anonymous";
    },
    message: {
        error: "Too many attempts for this account, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = { authLimiter };
