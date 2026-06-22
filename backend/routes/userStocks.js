const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/middleware");
const Stock = require("../models/stock");
const User = require("../models/user");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const stocks = await Stock.find({
      user: req.user.id,
    });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ error: "stock not found" });
    }

    if (stock.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "not authorized" });
    }

    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const body = req.body;
    const user = await User.findById(req.user.id);

    const { name, ticker, avgBuyPrice, quantity, currency } = body;
    const newStock = new Stock({
      name,
      ticker,
      avgBuyPrice,
      quantity,
      currency,
      user: user._id,
    });

    const savedStock = await newStock.save();
    user.stocks = user.stocks.concat(savedStock._id);
    await user.save();

    res.status(201).json(savedStock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ error: "stock not found" });
    }

    if (stock.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "not authorized" });
    }

    await stock.deleteOne();
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { avgBuyPrice, quantity } = req.body;
  try {
    const stockToBeUpdated = await Stock.findById(req.params.id);
    if (!stockToBeUpdated) {
      return res.status(404).json({ error: "Stock not found" });
    }

    if (stockToBeUpdated.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "not authorized" });
    }

    stockToBeUpdated.avgBuyPrice = avgBuyPrice;
    stockToBeUpdated.quantity = quantity;

    const updatedStock = await stockToBeUpdated.save();
    res.json(updatedStock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
