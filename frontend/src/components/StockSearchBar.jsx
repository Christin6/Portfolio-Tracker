import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import stockService from '../services/stock'
import AddOwnershipModal from './AddOwnershipModal'
import { useUserStocks, useAddStock } from '../hooks/useUserStocks'

const DEBOUNCE_MS = 320

const StockSearchBar = () => {
  const [query, setQuery] = useState('')
  const [search, setSearch] = useState(null) // null | { loading } | { items } | { error }
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [addTicker, setAddTicker] = useState(null)
  const containerRef = useRef(null)

  const { holdings = [] } = useUserStocks()
  const { mutate: addStock } = useAddStock()

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) {
      setSearch(null)
      setDropdownOpen(false)
      return
    }

    const ac = new AbortController()
    const timer = setTimeout(async () => {
      setSearch({ loading: true })
      setDropdownOpen(true)
      try {
        const items = await stockService.searchStocks(trimmed, { signal: ac.signal })
        if (!ac.signal.aborted) setSearch({ items })
      } catch (err) {
        if (err.name === 'AbortError') return
        if (!ac.signal.aborted) setSearch({ error: err.message || 'Search failed' })
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      ac.abort()
    }
  }, [query])

  useEffect(() => {
    const onPointerDown = (e) => {
      if (!containerRef.current?.contains(e.target)) setDropdownOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const pickSymbol = (symbol) => {
    if (!symbol) return
    const exists = holdings.some(
      (h) => h.ticker.toUpperCase() === symbol.toUpperCase()
    )
    if (exists) {
      toast.error(`${symbol} is already in your portfolio`)
      return
    }
    setAddTicker(symbol)
  }

  const handleConfirm = (stockData) => {
    addStock(stockData, {
      onSuccess: () => toast.success(`${stockData.ticker} added to portfolio`),
      onError: () => toast.error(`Failed to add ${stockData.ticker}`),
    })
    setQuery('')
    setSearch(null)
    setDropdownOpen(false)
  }

  const showPanel = dropdownOpen && search && query.trim() !== ''

  return (
    <div className="stock-search-bar" ref={containerRef}>
      <AddOwnershipModal
        ticker={addTicker}
        onDismiss={() => setAddTicker(null)}
        onConfirm={handleConfirm}
      />
      <form
        className="search-bar"
        onSubmit={(e) => {
          e.preventDefault()
          const t = query.trim()
          if (!t) return
          if (search?.items?.length > 0) pickSymbol(search.items[0].symbol)
          else toast.info('No matches — keep typing or pick from the list')
        }}
      >
        <input
          type="text"
          placeholder="Search stocks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (search && (search.loading || 'error' in search || 'items' in search)) {
              setDropdownOpen(true)
            }
          }}
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {showPanel && (
        <ul className="stock-search-bar-dropdown" role="listbox">
          {search.loading && (
            <li className="status-text status-text--compact">Searching…</li>
          )}
          {search.error && (
            <li className="status-text status-text--compact status-text--error">
              {search.error}
            </li>
          )}
          {search.items?.length === 0 && (
            <li className="status-text status-text--compact">No matches</li>
          )}
          {search.items?.map((row) => (
            <li key={row.symbol}>
              <button
                type="button"
                className="stock-search-bar-item"
                onClick={() => pickSymbol(row.symbol)}
              >
                <span className="stock-search-bar-symbol">{row.symbol}</span>
                <span className="stock-search-bar-name">{row.displayName}</span>
                <span className="stock-search-bar-meta">
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
