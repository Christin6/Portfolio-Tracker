import { useState, useEffect } from 'react'
import stockService from './services/stock'

import { useHoldingControls } from './stores/useHoldingStore'
import { toggleCurrentCurrency } from './stores/useCurrencyStore';

import { ToastContainer } from 'react-toastify';

import './Dashboard.css'
import PortfolioSummary from './components/PortfolioSummary'
import MainContent from './components/MainContent'

const mockHoldings = [
  { ticker: 'AAPL', quantity: 10, avgBuyPrice: 150.00 },
  { ticker: 'MSFT', quantity: 5, avgBuyPrice: 280.00 },
  { ticker: 'GOOGL', quantity: 3, avgBuyPrice: 2500.00 },
  { ticker: 'TSLA', quantity: 8, avgBuyPrice: 200.00 },
  { ticker: 'BBRI.JK', quantity: 100, avgBuyPrice: 4500.00 }
]

function App() {
  const { setHoldings } = useHoldingControls()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPortfolioData = async () => {
      setLoading(true)
      const portfolioData = []

      for (const holding of mockHoldings) {
        try {
          const quote = await stockService.getStockQuote(holding.ticker)
          const currentPrice = quote.regularMarketPrice
          const totalValue = currentPrice * holding.quantity
          const totalCost = holding.avgBuyPrice * holding.quantity
          const pl = totalValue - totalCost
          const plPercent = ((currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100

          portfolioData.push({
            name: quote.shortName || quote.longName || holding.ticker,
            ticker: holding.ticker,
            currentPrice,
            avgBuyPrice: holding.avgBuyPrice,
            quantity: holding.quantity,
            totalValue,
            pl,
            plPercent,
            currency: quote.currency
          })
        } catch (error) {
          console.error(`Failed to load ${holding.ticker}:`, error)
          // Add with placeholder data
          portfolioData.push({
            name: holding.ticker,
            ticker: holding.ticker,
            currentPrice: 0,
            avgBuyPrice: holding.avgBuyPrice,
            quantity: holding.quantity,
            totalValue: 0,
            pl: 0,
            plPercent: 0,
            currency: 'USD'
          })
        }
      }

      setHoldings(portfolioData)
      setLoading(false)
    }

    loadPortfolioData()
  }, [])

  const formatCurrency = (value, currency) => {
    if (currency === 'IDR') {
      return `Rp${value?.toLocaleString('id-ID')}`
    }
    return `$${value?.toFixed(2)}`
  }

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent?.toFixed(2)}%`
  }

  const addWrongCurrency = () => {
    toggleCurrentCurrency();
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading portfolio...</div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <ToastContainer />

      <div className="header">
        <form className="search-bar">
          <input type="text" placeholder="Search stocks..." />
          <button type="submit">Search</button>
        </form>
        <button onClick={addWrongCurrency}>Change Currency</button>
      </div>

      <PortfolioSummary
        formatCurrency={formatCurrency}
        formatPercent={formatPercent}
      />

      <MainContent
        formatCurrency={formatCurrency}
        formatPercent={formatPercent}
      />
    </div>
  )
}

export default App
