const express = require("express");
const router = express.Router();

const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const TRADEABLE_QUOTE_TYPES = new Set(["EQUITY", "ETF", "MUTUALFUND", "INDEX"]);

router.get("/search", async (req, res) => {
  try {
    const raw = req.query.q;
    const q = typeof raw === "string" ? raw.trim() : "";
    if (!q) {
      return res.status(400).json({ message: "Missing or empty search query" });
    }

    const results = await yahooFinance.search(q, {
      quotesCount: 7,
      newsCount: 0,
    });

    const quotes = (results.quotes || [])
      .filter(
        (item) =>
          item &&
          item.isYahooFinance === true &&
          item.quoteType &&
          TRADEABLE_QUOTE_TYPES.has(item.quoteType),
      )
      .slice(0, 7)
      .map((item) => ({
        symbol: item.symbol,
        displayName: item.shortname || item.longname || item.symbol,
        exchange: item.exchange,
        exchDisp: item.exchDisp,
        quoteType: item.quoteType,
        score: item.score,
      }));

    res.json({ quotes });
  } catch (err) {
    console.error("Stock search failed:", err);
    res.status(500).json({
      message: err.message || "Search failed",
    });
  }
});

router.get("/:ticker", async (req, res) => {
  const { ticker } = req.params;

  if (!/^[A-Z0-9.\-]{1,20}$/i.test(ticker)) {
    return res.status(400).json({ message: "Invalid ticker format" });
  }

  try {
    const quote = await yahooFinance.quote(ticker);
    res.json(quote);
  } catch (err) {
    console.error(`Fetching ${ticker} failed:`, err);
    res.status(500).json({
      message: err.message || `Fetching ${ticker} failed`,
    });
  }
});

module.exports = router;
