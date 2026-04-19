import { useState, useEffect } from 'react'
import stockService from './services/stock'

import './Dashboard.css'
import PortfolioSummary from './components/PortfolioSummary'
import MainContent from './components/MainContent'

function App() {
  const [holdings, setHoldings] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock holdings data - in a real app, this would come from a backend
  const mockHoldings = [
    { ticker: 'AAPL', quantity: 10, avgBuyPrice: 150.00 },
    { ticker: 'MSFT', quantity: 5, avgBuyPrice: 280.00 },
    { ticker: 'GOOGL', quantity: 3, avgBuyPrice: 2500.00 },
    { ticker: 'TSLA', quantity: 8, avgBuyPrice: 200.00 },
    { ticker: 'BBRI.JK', quantity: 100, avgBuyPrice: 4500.00 }
  ]

  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
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

  // Calculate portfolio totals
  const totalValue = holdings.reduce((sum, h) => sum + h.totalValue, 0)
  const totalCost = holdings.reduce((sum, h) => sum + (h.avgBuyPrice * h.quantity), 0)
  const totalPL = totalValue - totalCost
  const totalPLPercent = totalCost > 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0

  // Asset allocation data
  const allocationData = holdings.map(h => ({
    name: h.ticker,
    value: h.totalValue,
    percentage: totalValue > 0 ? (h.totalValue / totalValue) * 100 : 0
  })).sort((a, b) => b.value - a.value)

  // Growth data (simplified - showing current vs buy price)
  const growthData = holdings.map(h => ({
    ticker: h.ticker,
    growth: h.plPercent
  }))

  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6']

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading portfolio...</div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Portfolio Tracker</h1>
      </header>

      <PortfolioSummary
        totalValue={totalValue}
        totalCost={totalCost}
        totalPL={totalPL}
        totalPLPercent={totalPLPercent}
        formatCurrency={formatCurrency}
        formatPercent={formatPercent}
      />

      <MainContent
        holdings={holdings}
        allocationData={allocationData}
        growthData={growthData}
        formatCurrency={formatCurrency}
        formatPercent={formatPercent}
        colors={colors}
      />
    </div>
  )
}

export default App
