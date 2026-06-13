const baseUrl = "/api/userstock";

let token = null;

const setToken = (newToken) => {
    token = `Bearer ${newToken}`;
};

const getAllStocks = async () => {
    const response = await fetch(`${baseUrl}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch user's stocks.`);
    }
    const data = await response.json();
    return data;
};

const addStock = async (stockData) => {
    const response = await fetch(`${baseUrl}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify(stockData),
    });
    if (!response.ok) {
        throw new Error("Failed to add stock to portfolio.");
    }
    const data = await response.json();
    return data;
};

const deleteStock = async (stockId) => {
    const response = await fetch(`${baseUrl}/${stockId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to delete stock from portfolio.");
    }
};

const editStock = async (stockId, avgBuyPrice, quantity) => {
    const response = await fetch(`${baseUrl}/${stockId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify({ avgBuyPrice, quantity }),
    });
    if (!response.ok) {
        throw new Error("Failed to edit stock in portfolio.");
    }
    const data = await response.json();
    return data;
};

export default { getAllStocks, addStock, deleteStock, editStock, setToken };
