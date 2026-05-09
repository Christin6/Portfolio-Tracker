import { useEffect, useRef, useState, useCallback } from 'react'
import stockService from '../services/stock'

function buildHoldingFromQuote(quote, ticker, quantity, avgBuyPrice) {
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

function AddOwnershipModal({
        openModal,
        onRequestClose,
        ticker,
        onConfirm,
    }) {
    const dialogRef = useRef(null)
    const [quote, setQuote] = useState(null)
    const [quoteLoading, setQuoteLoading] = useState(false)
    const [quoteError, setQuoteError] = useState(null)
    const [quantity, setQuantity] = useState('1')
    const [avgBuyPrice, setAvgBuyPrice] = useState('')

    const closeDialog = useCallback(() => {
        const el = dialogRef.current
        if (el?.open) el.close()
    }, [])

    const showDialog = useCallback(() => {
        const el = dialogRef.current
        if (el && !el.open) el.showModal()
    }, [])

    useEffect(() => {
        if (!openModal) {
            closeDialog()
            return
        }
        showDialog()
    }, [openModal, closeDialog, showDialog])

    useEffect(() => {
        if (!openModal || !ticker) return

        let cancelled = false
        setQuote(null)
        setQuoteError(null)
        setQuantity('1')
        setAvgBuyPrice('')
        setQuoteLoading(true)

            ; (async () => {
                try {
                    const q = await stockService.getStockQuote(ticker)
                    if (cancelled) return
                    setQuote(q)
                    const p = q.regularMarketPrice
                    setAvgBuyPrice(p != null ? String(p) : '')
                } catch {
                    if (!cancelled) setQuoteError('Could not load a quote for this symbol.')
                } finally {
                    if (!cancelled) setQuoteLoading(false)
                }
            })()

        return () => {
            cancelled = true
        }
    }, [openModal, ticker])

    const handleNativeClose = () => {
        onRequestClose()
    }

    const handleCancel = () => {
        closeDialog()
    }

    const handleConfirm = () => {
        if (!quote || !ticker) return
        const qty = Number.parseFloat(quantity)
        const avg = Number.parseFloat(avgBuyPrice)
        if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(avg) || avg < 0) {
            return
        }
        onConfirm(buildHoldingFromQuote(quote, ticker, qty, avg))
        closeDialog()
    }

    return (
        <dialog
            ref={dialogRef}
            className="add-ownership-modal"
            onClose={handleNativeClose}
        >
            <div className="add-ownership-modal__inner">
                <h2 className="add-ownership-modal__title">
                    {ticker ? `Add ${ticker}` : 'Add holding'}
                </h2>

                {quoteLoading && (
                    <p className="add-ownership-modal__status">Loading quote…</p>
                )}

                {!quoteLoading && quoteError && (
                    <p className="add-ownership-modal__status add-ownership-modal__status--error">
                        {quoteError}
                    </p>
                )}

                {!quoteLoading && quote && !quoteError && (
                    <>
                        <p className="add-ownership-modal__meta">
                            Current price:{' '}
                            <strong>
                                {quote.regularMarketPrice != null
                                    ? `${quote.currency ?? ''} ${quote.regularMarketPrice}`.trim()
                                    : '—'}
                            </strong>
                        </p>
                        <label className="add-ownership-modal__field">
                            <span>Quantity</span>
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                            />
                        </label>
                        <label className="add-ownership-modal__field">
                            <span>Avg buy price</span>
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={avgBuyPrice}
                                onChange={(e) => setAvgBuyPrice(e.target.value)}
                            />
                        </label>
                    </>
                )}

                <div className="add-ownership-modal__actions">
                    <button
                        type="button"
                        className="add-ownership-modal__secondary"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="add-ownership-modal__primary"
                        onClick={handleConfirm}
                        disabled={!quote || quoteLoading || !!quoteError}
                    >
                        Add to portfolio
                    </button>
                </div>
            </div>
        </dialog>
    )
}

export default AddOwnershipModal
