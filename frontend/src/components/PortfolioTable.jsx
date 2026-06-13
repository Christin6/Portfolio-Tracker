import { formatCurrency } from '../helpers/formatCurrency'
import { useUserStocks, useEditStock } from '../hooks/useUserStocks'
import { useEffect, useRef, useState } from 'react'

const PortfolioTable = ({ formatPercent }) => {
  const { holdings, isLoading, isError } = useUserStocks()
  const { mutate: editStock } = useEditStock()

  const dialogRef = useRef(null)
  const [selectedHolding, setSelectedHolding] = useState(null)
  const [quantity, setQuantity] = useState(0)
  const [avgBuyPrice, setAvgBuyPrice] = useState(0)

  const openModal = (holding) => {
    setSelectedHolding(holding)
    setQuantity(holding.quantity)
    setAvgBuyPrice(holding.avgBuyPrice)
  }

  const closeModal = () => {
    const el = dialogRef.current
    if (el?.open) el.close()
    setSelectedHolding(null)
  }

  useEffect(() => {
    const el = dialogRef.current
    if (!selectedHolding) {
      if (el?.open) el.close()
      return
    }
    if (el && !el.open) el.showModal()
  }, [selectedHolding])

  const handleEditHolding = () => {
    editStock({
      stockId: selectedHolding.id,
      avgBuyPrice: Number(avgBuyPrice),
      quantity: Number(quantity),
    })
    closeModal()
  }

  if (isLoading) {
    return <div className="loading">Loading portfolio...</div>
  }

  if (isError) {
    return <div className="error">Failed to load portfolio data.</div>
  }

  return (
    <div className="card portfolio-table-section">
      <h2 className="card-title">Portfolio Holdings</h2>
      <table className="portfolio-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Ticker</th>
            <th>Current Price</th>
            <th>Avg Buy Price</th>
            <th>Quantity</th>
            <th>Total Value</th>
            <th>P/L %</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => (
            <tr key={holding.ticker}>
              <td>{holding.name}</td>
              <td className="ticker">{holding.ticker}</td>
              <td>{formatCurrency(holding.currentPrice, holding.currency)}</td>
              <td>{formatCurrency(holding.avgBuyPrice, holding.currency)}</td>
              <td>{holding.quantity}</td>
              <td>{formatCurrency(holding.totalValue, holding.currency)}</td>
              <td className={holding.plPercent >= 0 ? 'profit' : 'loss'}>
                {formatPercent(holding.plPercent)}
              </td>
              <td>
                <button
                  title="Edit Holding Amount"
                  onClick={() => openModal(holding)}
                  className="edit-holding-button"
                >
                  🖍
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <dialog ref={dialogRef} className="modal" onClose={() => setSelectedHolding(null)}>
        {selectedHolding && (
          <div className="modal-inner">
            <h2 className="modal-title">Edit Holding — {selectedHolding.ticker}</h2>
            <label className="modal-field">
              <span>Quantity</span>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </label>
            <label className="modal-field">
              <span>Average buy price</span>
              <input
                type="number"
                value={avgBuyPrice}
                onChange={(e) => setAvgBuyPrice(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="modal-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="button" onClick={handleEditHolding}>
                Save
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}

export default PortfolioTable
