const baseUrl = "/api/userstock";

const getAllStocks = async () => {
    const response = await fetch(baseUrl, {
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to fetch user's stocks.");
    return response.json();
};

const addStock = async (stockData) => {
    const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(stockData),
    });
    if (!response.ok) throw new Error("Failed to add stock to portfolio.");
    return response.json();
};

const deleteStock = async (stockId) => {
    const response = await fetch(`${baseUrl}/${stockId}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete stock from portfolio.");
};

const editStock = async (stockId, avgBuyPrice, quantity) => {
    const response = await fetch(`${baseUrl}/${stockId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ avgBuyPrice, quantity }),
    });
    if (!response.ok) throw new Error("Failed to edit stock in portfolio.");
    return response.json();
};

export default { getAllStocks, addStock, deleteStock, editStock };
