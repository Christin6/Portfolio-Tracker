import { useHoldings, usePortfolioTotals } from '../stores/useHoldingStore'
import { useMemo } from 'react'

const AllocationCard = () => {
  const holdings = useHoldings()
  const { totalValue } = usePortfolioTotals()
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6']

  const allocationData = useMemo(() => holdings.map((h) => ({
            name: h.ticker,
            value: h.totalValue,
            percentage: totalValue > 0 ? (h.totalValue / totalValue) * 100 : 0,
          })).sort((a, b) => b.value - a.value)
    , [holdings, totalValue])

  return (
    <div className="allocation-card">
      <h3 className="card-title">Asset Allocation</h3>
      <div className="allocation-chart">
        {allocationData.map((item, index) => (
          <div key={item.name} className="allocation-item">
            <span className="allocation-label">{item.name}</span>
            <div className="allocation-bar">
              <div
                className="allocation-fill"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: colors[index % colors.length]
                }}
              ></div>
            </div>
            <span className="allocation-value">{item.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllocationCard