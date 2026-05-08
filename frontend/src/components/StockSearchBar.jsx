import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'react-toastify'
import stockService from '../services/stock'
import { useHoldingControls, useHoldings } from '../stores/useHoldingStore'

const DEBOUNCE_MS = 320

function StockSearchBar() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchError, setSearchError] = useState(null)
  const [noResults, setNoResults] = useState(false)
  const containerRef = useRef(null)

  const holdings = useHoldings()
  const { addHolding } = useHoldingControls()

  const holdingHasTicker = useCallback(
    (symbol) =>
      holdings.some(
        (h) => h.ticker.toUpperCase() === String(symbol).toUpperCase(),
      ),
    [holdings],
  )

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setSuggestions([])
      setSearchError(null)
      setNoResults(false)
      setLoading(false)
      return
    }

    const ac = new AbortController()
    const timer = setTimeout(async () => {
      setLoading(true)
      setSearchError(null)
      setNoResults(false)
      setOpen(true)
      try {
        const quotes = await stockService.searchStocks(trimmed, {
          signal: ac.signal,
        })
        if (!ac.signal.aborted) {
          setSuggestions(quotes)
          setNoResults(quotes.length === 0)
        }
      } catch (err) {
        if (err.name === 'AbortError') return
        if (!ac.signal.aborted) {
          setSuggestions([])
          setSearchError(err.message || 'Search failed')
          setNoResults(false)
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      ac.abort()
    }
  }, [query])

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const addSymbol = async (symbol) => {
    if (!symbol) return
    if (holdingHasTicker(symbol)) {
      toast.error(`${symbol} is already in your portfolio`)
      return
    }
    try {
      const quote = await stockService.getStockQuote(symbol)
      const currentPrice = quote.regularMarketPrice
      const quantity = 1
      const avgBuyPrice = currentPrice
      const totalValue = currentPrice * quantity
      const totalCost = avgBuyPrice * quantity
      const pl = totalValue - totalCost
      const plPercent =
        avgBuyPrice > 0
          ? ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100
          : 0

      addHolding({
        name: quote.shortName || quote.longName || symbol,
        ticker: symbol,
        currentPrice,
        avgBuyPrice,
        quantity,
        totalValue,
        pl,
        plPercent,
        currency: quote.currency,
      })
      setQuery('')
      setSuggestions([])
      setOpen(false)
    } catch {
      toast.error(`Could not load a quote for ${symbol}`)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    if (suggestions.length > 0) {
      addSymbol(suggestions[0].symbol)
    } else {
      toast.info('No matches — keep typing or pick from the list')
    }
  }

  const showPanel =
    open &&
    (loading || searchError || suggestions.length > 0 || noResults)

  return (
    <div className="stock-search-bar" ref={containerRef}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>
      {showPanel && (
        <ul className="stock-search-bar__dropdown" role="listbox">
          {loading && (
            <li className="stock-search-bar__status">Searching…</li>
          )}
          {!loading && searchError && (
            <li className="stock-search-bar__status stock-search-bar__status--error">
              {searchError}
            </li>
          )}
          {!loading && !searchError && noResults && (
            <li className="stock-search-bar__status">No matches</li>
          )}
          {!loading &&
            !searchError &&
            suggestions.map((row) => (
              <li key={row.symbol}>
                <button
                  type="button"
                  className="stock-search-bar__item"
                  onClick={() => addSymbol(row.symbol)}
                >
                  <span className="stock-search-bar__symbol">{row.symbol}</span>
                  <span className="stock-search-bar__name">{row.displayName}</span>
                  <span className="stock-search-bar__meta">
                    {row.exchDisp || row.exchange || ''}
                    {row.quoteType ? ` · ${row.quoteType}` : ''}
                  </span>
                </button>
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}

export default StockSearchBar
