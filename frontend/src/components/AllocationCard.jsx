import { useHoldings, usePortfolioTotals } from '../stores/useHoldingStore'
import { useConvert } from "../hooks/useExchangeRates"
import { useMemo } from 'react'

const AllocationCard = () => {
  const holdings = useHoldings()
  const { totalValue } = usePortfolioTotals()
  const convert = useConvert()

  const allocationData = useMemo(() => {
    return holdings.map((h) => {
      const normalizedValue = convert(h.totalValue, h.currency)

      return {
        name: h.ticker,
        value: normalizedValue,
        percentage: totalValue > 0 ? (normalizedValue / totalValue) * 100 : 0,
      }
    }).sort((a, b) => b.value - a.value)
  }, [holdings, totalValue, convert])

  console.log(allocationData);

  return (
    <div className="allocation-card">
      <h3 className="card-title">Asset Allocation</h3>
      <div className="allocation-chart">
        {allocationData.map((item) => (
          <div key={item.name} className="allocation-item">
            <span className="allocation-label">{item.name}</span>
            <div className="allocation-bar">
              <div
                className="allocation-fill"
                style={{
                  width: `${item.percentage}%`
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