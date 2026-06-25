const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middleware/middleware");

router.get("/", authMiddleware, (req, res) => {
    res.json({ username: req.user.username, id: req.user.id });
});

module.exports = router;
