const express = require("express");
const router = express.Router();

const CURRENCY_API_MIRRORS = [
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies",
    "https://latest.currency-api.pages.dev/v1/currencies",
];

async function fetchCurrencyDate(targetCurrency) {
    for (const baseUrl of CURRENCY_API_MIRRORS) {
        try {
            const url = `${baseUrl}/${targetCurrency}.json`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return await res.json();
        } catch (err) {
            console.warn(
                `Currency API mirror failed (${baseUrl}):`,
                err.message,
            );
        }
    }
    throw new Error("All currency API mirrors failed");
}

router.get("/:currency", async (request, response) => {
    const targetCurrency = request.params.currency.toLowerCase();
    try {
        const data = await fetchCurrencyDate(targetCurrency);

        const flattenedRates = data[targetCurrency];

        if (!flattenedRates) {
            throw new Error(
                `Rates for ${targetCurrency} not found in API response`,
            );
        }

        response.json(flattenedRates);
    } catch (err) {
        console.error(err.message);
        response.status(500).json({ error: "Failed to fetch currency data" });
    }
});

module.exports = router;
