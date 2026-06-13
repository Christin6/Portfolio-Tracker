import { useEffect, useRef, useState } from 'react'
import stockService from '../services/stock'

function AddOwnershipModal({ ticker, onDismiss, onConfirm }) {
  const dialogRef = useRef(null)
  const open = ticker != null

  const [load, setLoad] = useState(null) // null | 'loading' | { error } | { quote }
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

    return () => { cancelled = true }
  }, [ticker])

  const closeDialog = () => {
    const el = dialogRef.current
    if (el?.open) el.close()
  }

  const handleConfirm = () => {
    if (!load?.quote || !ticker) return

    const quantity = Number.parseFloat(qty)
    const avgBuyPrice = Number.parseFloat(avg)

    if (!Number.isFinite(quantity) || quantity <= 0) return
    if (!Number.isFinite(avgBuyPrice) || avgBuyPrice < 0) return

    onConfirm({
      name: load.quote.shortName || load.quote.longName || ticker,
      ticker,
      avgBuyPrice,
      quantity,
      currency: load.quote.currency,
    })

    closeDialog()
  }

  const canSubmit = load?.quote && load !== 'loading' && !load?.error

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      onClose={onDismiss}
    >
      <div className="modal-inner">
        <h2 className="modal-title">
          {ticker ? `Add ${ticker}` : 'Add holding'}
        </h2>

        {load === 'loading' && (
          <p className="status-text status-text--block">Loading quote…</p>
        )}

        {load?.error && (
          <p className="status-text status-text--block status-text--error">
            {load.error}
          </p>
        )}

        {load?.quote && (
          <>
            <p className="modal-meta">
              Current price:{' '}
              <strong>
                {load.quote.regularMarketPrice != null
                  ? `${load.quote.currency ?? ''} ${load.quote.regularMarketPrice}`.trim()
                  : '—'}
              </strong>
            </p>
            <label className="modal-field">
              <span>Quantity</span>
              <input
                type="number"
                min="0"
                step="any"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </label>
            <label className="modal-field">
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

        <div className="modal-actions">
          <button
            type="button"
            className="modal-secondary"
            onClick={closeDialog}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canSubmit}
          >
            Add to portfolio
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default AddOwnershipModal
