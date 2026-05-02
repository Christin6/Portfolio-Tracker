const baseUrl = "http://localhost:3001/api/news";

const getTickerNews = async (ticker) => {
    const res = await fetch(`${baseUrl}/${ticker}`);
    if (!res.ok) throw new Error(`News fetch failed: ${res.status}`);
    return res.json();
};

export default { getTickerNews };
