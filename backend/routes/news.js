const express = require("express");
const router = express.Router();
require("dotenv").config();

const companyNewsBaseUrl = "https://finnhub.io/api/v1/company-news";

router.get("/:ticker", async (req, res) => {
    try {
        const { ticker } = req.params;

        const today = new Date().toISOString().split("T")[0]; // formatted for API
        const unformattedLastWeek = new Date();
        unformattedLastWeek.setDate(unformattedLastWeek.getDate() - 7);
        const lastWeek = unformattedLastWeek.toISOString().split("T")[0];

        const url = `${companyNewsBaseUrl}?symbol=${ticker}&from=${lastWeek}&to=${today}&token=${process.env.FINNHUB_KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        res.json(data.slice(0, 10));
    } catch (err) {
        res.status(505).json({ error: err.message });
    }
});

module.exports = router;
