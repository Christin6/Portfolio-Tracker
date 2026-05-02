import { useCurrentCurrency } from "../stores/useCurrencyStore";
import { useQuery } from "@tanstack/react-query";

import currencyService from "../services/currency";

const useExchangeRates = () => {
    const baseCurrency = useCurrentCurrency().toLowerCase();

    return useQuery({
        queryKey: ["rates", baseCurrency],
        queryFn: async () => currencyService.getCurrencyRate(baseCurrency),
        staleTime: 1000 * 60 * 60,
    });
};

export const useConvert = () => {
    const baseCurrency = useCurrentCurrency();
    const { data: rates } = useExchangeRates();

    return (amount, fromCurrency) => {
        if (!rates || fromCurrency === baseCurrency) return amount;
        // fawazahmed0 rates are base→X, so to convert FROM X TO base:
        const fromRate = rates[fromCurrency.toLowerCase()];
        console.log({ amount, fromCurrency, fromRate, rates });
        return amount / fromRate;
    };
};
