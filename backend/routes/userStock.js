const express = require("express");
const router = express.Router();

const Stock = require("../models/stock");

router.get("/", async (req, res) => {
    try {
        const stocks = await Stock.find({});
        res.json(stocks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const stock = await Stock.findById(req.params.id);
        if (stock) {
            res.json(stock);
        } else {
            res.status(404).json({ error: "Stock not found" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const { name, ticker, avgBuyPrice, quantity, currency } = req.body;
        const newStock = new Stock({
            name,
            ticker,
            avgBuyPrice,
            quantity,
            currency,
        });
        const savedStock = await newStock.save();
        res.status(201).json(savedStock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const deletedStock = await Stock.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedStock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    const { avgBuyPrice, quantity } = req.body;
    try {
        const stockToBeUpdated = await Stock.findById(req.params.id);
        if (!stockToBeUpdated) {
            return res.status(404).json({ error: "Stock not found" });
        }

        stockToBeUpdated.avgBuyPrice = avgBuyPrice;
        stockToBeUpdated.quantity = quantity;

        const updatedStock = await stockToBeUpdated.save();
        res.json(updatedStock);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = router;