import { useHoldings } from '../stores/useHoldingStore'
import { useMemo } from 'react'

const GrowthCard = ({ formatPercent }) => {
  const holdings = useHoldings()

  const growthData = useMemo(() => holdings.map((h) => ({
    ticker: h.ticker,
    growth: h.plPercent,
  })), [holdings])

  return (
    <div className="growth-card">
      <h3 className="card-title">Asset Performance</h3>
      <div className="growth-chart">
        {growthData.map((item) => (
          <div
            key={item.ticker}
            className="growth-bar"
            style={{
              height: `${Math.max(10, Math.abs(item.growth) * 2)}px`,
              backgroundColor: item.growth >= 0 ? '#3BC1A8' : '#e67b8f'
            }}
            title={`${item.ticker}: ${formatPercent(item.growth)}`}
          ></div>
        ))}
      </div>
      <div className="growth-labels">
        {growthData.map(item => (
          <span key={item.ticker}>{item.ticker}</span>
        ))}
      </div>
    </div>
  )
}

export default GrowthCard