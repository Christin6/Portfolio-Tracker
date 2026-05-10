export const formatCurrency = (value, currency) => {
    const amount = Number(value);
    const code = (currency || "USD").toUpperCase();

    if (!Number.isFinite(amount)) {
        return "Invalid amount";
    }

    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: code,
        }).format(amount);
    } catch (e) {
        console.error("Error formatting currency:", e);
        return `${code} ${amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }
};