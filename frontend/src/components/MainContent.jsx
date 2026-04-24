import GrowthCard from "./GrowthCard"
import PortfolioTable from "./PortfolioTable"
import AllocationCard from "./AllocationCard"

const MainContent = ({ formatCurrency, formatPercent }) => {
  return (
    <div className="main-content">
      <PortfolioTable 
        formatCurrency={formatCurrency} 
        formatPercent={formatPercent} 
      />

      <div className="right-panel">
        <AllocationCard />

        <GrowthCard 
          formatPercent={formatPercent} 
        />
      </div>
    </div>
  )
}

export default MainContent