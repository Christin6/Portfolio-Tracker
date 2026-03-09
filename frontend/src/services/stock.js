const baseUrl = 'http://localhost:3001/api/stock'

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

export default { getStockPrice, getStockQuote }