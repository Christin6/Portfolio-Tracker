const express = require("express");
const router = express.Router();

const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

router.get("/:ticker", async (req, res) => {
    const { ticker } = req.params;
    const quote = await yahooFinance.quote(ticker);
    res.json(quote);
});

module.exports = router;