import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

const useHoldingStore = create((set) => ({
    holdings: [],
    actions: {
        setHoldings: (holdings) => set({ holdings }),
        addHolding: (holding) =>
            set((state) => ({ holdings: state.holdings.concat(holding) })),
    },
}));

export const useHoldings = () => useHoldingStore((state) => state.holdings);
export const useHoldingControls = () =>
    useHoldingStore((state) => state.actions);

export const usePortfolioTotals = () =>
    useHoldingStore(
        useShallow((state) => {
            const totalValue = state.holdings.reduce(
                (sum, h) => sum + h.totalValue,
                0,
            );
            const totalCost = state.holdings.reduce(
                (sum, h) => sum + h.avgBuyPrice * h.quantity,
                0,
            );
            const totalPL = totalValue - totalCost;
            const totalPLPercent =
                totalCost > 0
                    ? ((totalValue - totalCost) / totalCost) * 100
                    : 0;
            return { totalValue, totalCost, totalPL, totalPLPercent };
        }),
    );
