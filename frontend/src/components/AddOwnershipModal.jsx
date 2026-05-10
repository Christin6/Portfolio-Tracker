import { useEffect, useRef, useState } from 'react'
import stockService from '../services/stock'

function holdingFromInputs(quote, ticker, qtyStr, avgStr) {
  const quantity = Number.parseFloat(qtyStr)
  const avgBuyPrice = Number.parseFloat(avgStr)
  if (
    !Number.isFinite(quantity) ||
    quantity <= 0 ||
    !Number.isFinite(avgBuyPrice) ||
    avgBuyPrice < 0
  ) {
    return null
  }
  const currentPrice = quote.regularMarketPrice
  const totalValue = currentPrice * quantity
  const totalCost = avgBuyPrice * quantity
  const pl = totalValue - totalCost
  const plPercent =
    avgBuyPrice > 0 ? ((currentPrice - avgBuyPrice) / avgBuyPrice) * 100 : 0

  return {
    name: quote.shortName || quote.longName || ticker,
    ticker,
    currentPrice,
    avgBuyPrice,
    quantity,
    totalValue,
    pl,
    plPercent,
    currency: quote.currency,
  }
}

function AddOwnershipModal({ ticker, onDismiss, onConfirm }) {
  const dialogRef = useRef(null)
  const open = ticker != null

  /** null | 'loading' | { error } | { quote } */
  const [load, setLoad] = useState(null)
  const [qty, setQty] = useState('1')
  const [avg, setAvg] = useState('')

  useEffect(() => {
    const el = dialogRef.current
    if (!open) {
      if (el?.open) el.close()
      return
    }
    if (el && !el.open) el.showModal()
  }, [open])

  useEffect(() => {
    if (!ticker) {
      setLoad(null)
      setQty('1')
      setAvg('')
      return
    }

    let cancelled = false
    setLoad('loading')
    setQty('1')
    setAvg('')

    ;(async () => {
      try {
        const q = await stockService.getStockQuote(ticker)
        if (cancelled) return
        const p = q.regularMarketPrice
        setAvg(p != null ? String(p) : '')
        setLoad({ quote: q })
      } catch {
        if (!cancelled) setLoad({ error: 'Could not load a quote for this symbol.' })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [ticker])

  const closeDialog = () => {
    const el = dialogRef.current
    if (el?.open) el.close()
  }

  return (
    <dialog
      ref={dialogRef}
      className="add-ownership-modal"
      onClose={onDismiss}
    >
      <div className="add-ownership-modal-inner">
        <h2 className="add-ownership-modal-title">
          {ticker ? `Add ${ticker}` : 'Add holding'}
        </h2>

        {load === 'loading' && (
          <p className="add-ownership-modal-status">Loading quote…</p>
        )}

        {load?.error && (
          <p className="add-ownership-modal-status add-ownership-modal-status--error">
            {load.error}
          </p>
        )}

        {load?.quote && (
          <>
            <p className="add-ownership-modal-meta">
              Current price:{' '}
              <strong>
                {load.quote.regularMarketPrice != null
                  ? `${load.quote.currency ?? ''} ${load.quote.regularMarketPrice}`.trim()
                  : '—'}
              </strong>
            </p>
            <label className="add-ownership-modal-field">
              <span>Quantity</span>
              <input
                type="number"
                min="0"
                step="any"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </label>
            <label className="add-ownership-modal-field">
              <span>Avg buy price</span>
              <input
                type="number"
                min="0"
                step="any"
                value={avg}
                onChange={(e) => setAvg(e.target.value)}
              />
            </label>
          </>
        )}

        <div className="add-ownership-modal-actions">
          <button
            type="button"
            className="add-ownership-modal-secondary"
            onClick={closeDialog}
          >
            Cancel
          </button>
          <button
            type="button"
            className="add-ownership-modal-primary"
            onClick={() => {
              if (!load?.quote || !ticker) return
              const row = holdingFromInputs(load.quote, ticker, qty, avg)
              if (!row) return
              onConfirm(row)
              closeDialog()
            }}
            disabled={!load?.quote || load === 'loading' || !!load?.error}
          >
            Add to portfolio
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default AddOwnershipModal
