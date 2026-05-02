import PortfolioTable from "./PortfolioTable"
import NewsPanel from "./NewsPanel"
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

        <NewsPanel ticker={"AAPL"} />
      </div>
    </div>
  )
}

export default MainContent