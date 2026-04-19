const AllocationCard = ({ allocationData, colors }) => {
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