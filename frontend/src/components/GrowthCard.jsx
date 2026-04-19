const GrowthCard = ({ growthData, formatPercent }) => {
  return (
    <div className="growth-card">
      <h3 className="card-title">Asset Performance</h3>
      <div className="growth-chart">
        {growthData.map((item, index) => (
          <div
            key={item.ticker}
            className="growth-bar"
            style={{
              height: `${Math.max(10, Math.abs(item.growth) * 2)}px`,
              backgroundColor: item.growth >= 0 ? '#28a745' : '#dc3545'
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