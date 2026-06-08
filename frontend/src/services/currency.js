const baseUrl = '/api/currency';

const getCurrencyRate = async (baseCurrency) => {
    const res = await fetch(`${baseUrl}/${baseCurrency}`);
    if (!res.ok) {
        // This triggers the 'error' state in React Query
        const errorData = await res.json();
        throw new Error(errorData.error || 'Network error');
    }
    return await res.json();
};

export default { getCurrencyRate };
