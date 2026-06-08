const baseUrl = '/api/stock'

const getStockPrice = async (ticker) => {
  const response = await fetch(`${baseUrl}/${ticker}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch stock with ticker ${ticker}.`)
  }
  const data = await response.json()
  return data.regularMarketPrice
}

const getStockQuote = async (ticker) => {
  const response = await fetch(`${baseUrl}/${ticker}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch stock with ticker ${ticker}.`)
  }
  const data = await response.json()
  return data
}

const searchStocks = async (query, options = {}) => {
  const { signal } = options
  const response = await fetch(
    `${baseUrl}/search?q=${encodeURIComponent(query)}`,
    { signal },
  )
  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}))
    const message =
      errBody.message ||
      `Search failed (${response.status})`
    throw new Error(message)
  }
  const data = await response.json()
  return data.quotes ?? []
}

export default { getStockPrice, getStockQuote, searchStocks }