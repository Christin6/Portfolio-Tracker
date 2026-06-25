const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middleware/middleware");

router.post("/", authMiddleware, (req, res) => {
    res.clearCookie("accessToken");
    res.json({ message: "Logged out" });
});

module.exports = router;
