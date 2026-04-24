import { useHoldings } from '../stores/useHoldingStore'

const PortfolioTable = ({ formatCurrency, formatPercent }) => {
  const holdings = useHoldings()
  
  return (
    <div className="portfolio-table-section">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PortfolioTable