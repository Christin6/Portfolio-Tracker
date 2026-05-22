const baseUrl = "http://localhost:3001/api/news";

const getTickerNews = async (ticker) => {
    const res = await fetch(`${baseUrl}/${ticker}`);
    if (!res.ok) throw new Error(`News fetch failed: ${res.status}`);
    return res.json();
};

const getGeneralNews = async () => {
    const res = await fetch(`${baseUrl}/general`);
    if (!res.ok) throw new Error(`News fetch failed: ${res.status}`);
    return res.json();
}

const getGeneralIndonesiaNews = async () => {
    const res = await fetch(`${baseUrl}/indonesia/general`);
    if (!res.ok) throw new Error(`News fetch failed: ${res.status}`);
    return res.json();
}

export default { getTickerNews, getGeneralNews, getGeneralIndonesiaNews };
