import { useState, useEffect } from 'react'
import stockService from './services/stock'

import { useHoldingControls } from './stores/useHoldingStore'
import { toggleCurrentCurrency, useCurrentCurrency } from './stores/useCurrencyStore'

import { ToastContainer } from 'react-toastify'

import './Dashboard.css'
import PortfolioSummary from './components/PortfolioSummary'
import MainContent from './components/MainContent'
import StockSearchBar from './components/StockSearchBar'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    }
  }
})

const mockHoldings = [
  { ticker: 'AAPL', quantity: 10, avgBuyPrice: 150.00 },
  { ticker: 'MSFT', quantity: 5, avgBuyPrice: 280.00 },
  { ticker: 'GOOGL', quantity: 3, avgBuyPrice: 250.00 },
  { ticker: 'TSLA', quantity: 8, avgBuyPrice: 200.00 },
  { ticker: 'BBRI.JK', quantity: 100, avgBuyPrice: 4500.00 }
]

function App() {
  const { setHoldings } = useHoldingControls()
  const [loading, setLoading] = useState(true)

  const currentCurrency = useCurrentCurrency();

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

  const formatPercent = (percent) => {
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent?.toFixed(2)}%`
  }

  const toggleCurrency = () => {
    toggleCurrentCurrency()
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading portfolio...</div>
      </div>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="dashboard">
        <ToastContainer />

        <div className="header">
          <StockSearchBar />
          <button className="currency-toggle" onClick={toggleCurrency}>
            {currentCurrency}
          </button>
        </div>

        <PortfolioSummary
          formatPercent={formatPercent}
        />

        <MainContent
          formatPercent={formatPercent}
        />
      </div>
    </QueryClientProvider>
  )
}

export default App
