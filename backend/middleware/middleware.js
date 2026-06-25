const jwt = require("jsonwebtoken");

const requestLogger = (request, response, next) => {
    console.log("Method:", request.method);
    console.log("Path:  ", request.path);
    console.log("Body:  ", request.body);
    console.log("---");
    next();
};

const getTokenFrom = (request) => {
    const token = request.cookies?.accessToken;
    return token;
};

const authMiddleware = (req, res, next) => {
    try {
        const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET);
        req.user = decodedToken;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res
                .status(401)
                .json({ error: "Token expired", code: "TOKEN_EXPIRED" });
        }
        if (err.name === "JsonWebTokenError") {
            return res
                .status(401)
                .json({ error: "Invalid token", code: "TOKEN_INVALID" });
        }
        return res.status(500).json({ error: "Auth error" });
    }
};

module.exports = {
    requestLogger,
    authMiddleware,
};
