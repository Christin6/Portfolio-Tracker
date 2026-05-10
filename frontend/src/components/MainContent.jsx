import PortfolioTable from "./PortfolioTable"
import NewsPanel from "./NewsPanel"
import AllocationCard from "./AllocationCard"

const MainContent = ({ formatPercent }) => {
  return (
    <div className="main-content">
      <PortfolioTable 
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