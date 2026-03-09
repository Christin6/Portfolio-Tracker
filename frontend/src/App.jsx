import { useState, useEffect } from 'react'
import stockService from './services/stock'
import './Dashboard.css'

function App() {
  const [stocks, setStocks] = useState([])
  const [portfolioValue, setPortfolioValue] = useState(0)
  const [totalChange, setTotalChange] = useState(0)
  const [newTicker, setNewTicker] = useState('')
  const [loading, setLoading] = useState(false)

  const defaultStocks = ['BBRI.JK', 'MSFT', 'AAPL', 'GOOGL', 'TSLA']

  useEffect(() => {
    loadStocks()
  }, [])

  const loadStocks = async () => {
    setLoading(true)
    const stockData = []
    let totalValue = 0
    let totalChangeValue = 0

    for (const ticker of defaultStocks) {
      try {
        const quote = await stockService.getStockQuote(ticker)
        const stock = {
          symbol: quote.symbol,
          name: quote.shortName || quote.longName || ticker,
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          currency: quote.currency
        }
        stockData.push(stock)
        totalValue += stock.price
        totalChangeValue += stock.change
      } catch (error) {
        console.error(`Failed to load ${ticker}:`, error)
      }
    }

    setStocks(stockData)
    setPortfolioValue(totalValue)
    setTotalChange(totalChangeValue)
    setLoading(false)
  }

  const addStock = async () => {
    if (!newTicker.trim()) return

    try {
      const quote = await stockService.getStockQuote(newTicker.trim().toUpperCase())
      const stock = {
        symbol: quote.symbol,
        name: quote.shortName || quote.longName || newTicker,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        currency: quote.currency
      }
      setStocks(prev => [...prev, stock])
      setPortfolioValue(prev => prev + stock.price)
      setTotalChange(prev => prev + stock.change)
      setNewTicker('')
    } catch (error) {
      alert(`Failed to add stock: ${error.message}`)
    }
  }

  const formatCurrency = (value, currency) => {
    if (currency === 'IDR') {
      return `Rp${value?.toLocaleString('id-ID')}`
    }
    return `$${value?.toFixed(2)}`
  }

  const formatChange = (change, percent) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change?.toFixed(2)} (${sign}${percent?.toFixed(2)}%)`
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Portfolio Tracker</h1>
      </header>

      <div className="portfolio-summary">
        <div className="summary-item">
          <h3>Total Value</h3>
          <p>${portfolioValue.toFixed(2)}</p>
        </div>
        <div className="summary-item">
          <h3>Today's Change</h3>
          <p className={totalChange >= 0 ? 'change-positive' : 'change-negative'}>
            {formatChange(totalChange, (totalChange / portfolioValue) * 100)}
          </p>
        </div>
        <div className="summary-item">
          <h3>Stocks Tracked</h3>
          <p>{stocks.length}</p>
        </div>
      </div>

      <div className="stocks-grid">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="stock-card">
            <div className="stock-header">
              <div>
                <div className="stock-symbol">{stock.symbol}</div>
                <div className="stock-name">{stock.name}</div>
              </div>
            </div>
            <div className="stock-price">
              {formatCurrency(stock.price, stock.currency)}
            </div>
            <div className={`stock-change ${stock.change >= 0 ? 'change-positive' : 'change-negative'}`}>
              {formatChange(stock.change, stock.changePercent)}
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <input
          type="text"
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          placeholder="Enter stock ticker (e.g., NVDA)"
          style={{
            padding: '10px',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '5px',
            marginRight: '10px',
            width: '200px'
          }}
        />
        <button className="add-stock" onClick={addStock} disabled={loading}>
          Add Stock
        </button>
      </div>

      {loading && <p className="loading">Loading stocks...</p>}
    </div>
  )
}

export default App
