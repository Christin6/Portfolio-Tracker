const express = require("express");
const router = express.Router();

const companyNewsBaseUrl = "https://finnhub.io/api/v1/company-news";
const generalNewsBaseUrl = `https://finnhub.io/api/v1/news?category=general&token=${process.env.FINNHUB_KEY}`;

let Parser = require('rss-parser');
let parser = new Parser();

router.get("/general", async (req, res) => {
    try {
        const url = generalNewsBaseUrl;

        const response = await fetch(url);
        const data = await response.json();
        res.json(data.slice(0, 10));
    } catch (err) {
        res.status(505).json({ error: err.message });
    }
});

router.get("/indonesia/general", async (req, res) => {
    try {
        const url = "https://katadata.co.id/rss";
        let feed = await parser.parseURL(url);
        const filteredFeed = feed.items.filter(item =>
            item.link?.includes("katadata.co.id/finansial") // filter only financial news
        );
        const articles = filteredFeed.slice(0, 10).map((item) => ({ // transform to match Finnhub news format
            headline: item.title,
            url: item.link,
            datetime: Math.floor(new Date(item.pubDate).getTime() / 1000), // match Finnhub format
            source: "Kontan",
            summary: item.contentSnippet ?? "",
            image: null,
        }));
        res.json(articles);
        
    } catch (err) {
        res.status(505).json({ error: err.message });
    }
});


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
