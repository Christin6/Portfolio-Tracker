import { create } from "zustand";
import { toast } from "react-toastify";

const useCurrencyStore = create((set) => ({
    currentCurrency: "USD",
    currencyOptions: ["USD", "IDR"],
    actions: {
        addCurrencyOption: currency => 
            set((state) => { currencyOptions: state.currencyOptions.concat(currency) }),
        setCurrentCurrency: currency => set({ currentCurrency: currency }),
    }
}));

export const useCurrentCurrency = () => useCurrencyStore((state) => state.currentCurrency);

export const addCurrencyOption = (currency) => {
    const { currencyOptions, actions: { addCurrencyOption } } = useCurrencyStore.getState()

    if (!currencyOptions.includes(currency)) {
        addCurrencyOption(currency);
    } else {
        toast.error(`${currency} is already in the options`);
    }
}

export const toggleCurrentCurrency = () => {
    const { currentCurrency, currencyOptions, actions: { setCurrentCurrency } } = useCurrencyStore.getState()
    const currentIndex = currencyOptions.indexOf(currentCurrency)
    const nextIndex = (currentIndex + 1) % currencyOptions.length
    setCurrentCurrency(currencyOptions[nextIndex])
    toast(`Switched to ${currencyOptions[nextIndex]} from ${currentCurrency}`)
}