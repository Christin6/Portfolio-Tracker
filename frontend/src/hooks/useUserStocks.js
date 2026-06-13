import { useQuery, useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import userStockService from "../services/userStock";
import stockService from "../services/stock";
import { useMemo } from "react";
import { useConvert } from "./useExchangeRates";
import { addCurrencyOption } from "../stores/useCurrencyStore";

export const useRawUserStocks = () => {
    return useQuery({
        queryKey: ["userStocks"],
        queryFn: () => userStockService.getAllStocks(),
        staleTime: 5 * 60 * 1000, // 5 min — stock prices can be considered relatively fresh for a short period
    });
};

export const useUserStocks = () => {
    const { data: rawHoldings = [], isLoading, isError } = useRawUserStocks();

    const priceQueries = useQueries({
        queries: rawHoldings.map((h) => ({
            queryKey: ["stock", h.ticker],
            queryFn: () => stockService.getStockPrice(h.ticker),
            staleTime: 5 * 60 * 1000,
            enabled: rawHoldings.length > 0,
        })),
    });

    const holdings = useMemo(() => {
        if (!rawHoldings.length) return [];

        // calculate and return derived values for each holding
        return rawHoldings.map((holding, i) => {
            const currentPrice = priceQueries[i]?.data ?? null;
            const totalValue = currentPrice * holding.quantity;
            const totalCost = holding.avgBuyPrice * holding.quantity;
            const pl = totalValue - totalCost;
            const plPercent =
                ((currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) *
                100;

            return {
                ...holding, // name, ticker, avgBuyPrice, quantity, currency from MongoDB
                currentPrice, // live from Yahoo Finance
                totalValue,
                totalCost,
                pl,
                plPercent, // computed
            };
        });
    }, [rawHoldings, priceQueries]);

    rawHoldings.forEach(h => addCurrencyOption(h.currency));

    return { holdings, isLoading, isError };
};

export const usePortfolioTotals = () => {
    const { holdings, isLoading, isError } = useUserStocks();
    const convert = useConvert();

    const totals = useMemo(() => {
        if (!holdings.length)
            return { totalValue: 0, totalCost: 0, totalPL: 0, plPercent: 0 };

        const totalValue = holdings.reduce(
            (sum, h) =>
                sum +
                (h.totalValue != null ? convert(h.totalValue, h.currency) : 0),
            0,
        );
        const totalCost = holdings.reduce(
            (sum, h) => sum + convert(h.totalCost, h.currency),
            0,
        );
        const totalPL = totalValue - totalCost;
        const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

        return { totalValue, totalCost, totalPL, totalPLPercent };
    }, [holdings, convert]);

    return { ...totals, isLoading, isError };
};

export const useAddStock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (stockData) => userStockService.addStock(stockData),
        onSuccess: () => {
            // invalidate the cache so the table refetches with the new stock
            queryClient.invalidateQueries({ queryKey: ["userStocks"] });
        }
    })
}

export const useDeleteStock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (stockId) => userStockService.deleteStock(stockId),
        onSuccess: () => {
            // invalidate the cache so the table refetches without the deleted stock
            queryClient.invalidateQueries({ queryKey: ["userStocks"] });
        }
    })
}

export const useEditStock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ stockId, avgBuyPrice, quantity }) => userStockService.editStock(stockId, avgBuyPrice, quantity),
        onSuccess: () => {
            // invalidate the cache so the table refetches with the updated stock
            queryClient.invalidateQueries({ queryKey: ["userStocks"] });
        }
    })
}