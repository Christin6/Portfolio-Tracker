const PortfolioSummary = ({ totalValue, totalCost, totalPL, totalPLPercent, formatCurrency, formatPercent }) => {
  return (
    <div className="portfolio-summary">
      <div className="summary-card">
        <h3>Total Value</h3>
        <p>{formatCurrency(totalValue, 'USD')}</p>
      </div>
      <div className="summary-card">
        <h3>Total Cost</h3>
        <p>{formatCurrency(totalCost, 'USD')}</p>
      </div>
      <div className="summary-card">
        <h3>Total P/L</h3>
        <p className={totalPL >= 0 ? 'profit' : 'loss'}>
          {formatCurrency(totalPL, 'USD')}
        </p>
      </div>
      <div className="summary-card">
        <h3>P/L %</h3>
        <p className={totalPLPercent >= 0 ? 'profit' : 'loss'}>
          {formatPercent(totalPLPercent)}
        </p>
      </div>
    </div>
  )
}

export default PortfolioSummary