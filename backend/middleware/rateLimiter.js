const rateLimit = require("express-rate-limit");

const getIPv6Subnet = (ip, subnetSize = 56) => {
    if (!ip.includes(":")) return ip; // IPv4, return as-is
    const parts = ip.split(":");
    const bitsToKeep = subnetSize;
    const groupsToKeep = Math.floor(bitsToKeep / 16);
    return parts.slice(0, groupsToKeep).join(":") + "::/" + subnetSize;
};

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: { error: "Too many attempts, please try again later" },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        const ip = getIPv6Subnet(req.ip);
        const username = req.body?.username || req.body?.email || "anonymous";
        return `${ip}:${username}`;
    },
});

const usernameLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    message: {
        error: "Too many attempts for this account, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.body?.username || req.body?.email || "anonymous";
    },
});

module.exports = { authLimiter, usernameLimiter };
