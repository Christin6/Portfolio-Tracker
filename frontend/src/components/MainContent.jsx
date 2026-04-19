import GrowthCard from "./GrowthCard"
import PortfolioTable from "./PortfolioTable"
import AllocationCard from "./AllocationCard"

const MainContent = ({ holdings, allocationData, growthData, formatCurrency, formatPercent, colors }) => {
  return (
    <div className="main-content">
      <PortfolioTable 
        holdings={holdings} 
        formatCurrency={formatCurrency} 
        formatPercent={formatPercent} 
      />

      <div className="right-panel">
        <AllocationCard 
          allocationData={allocationData} 
          colors={colors} 
        />

        <GrowthCard 
          growthData={growthData} 
          formatPercent={formatPercent} 
        />
      </div>
    </div>
  )
}

export default MainContent