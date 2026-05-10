import PortfolioTable from "./PortfolioTable"
import GeneralNewsPanel from "./NewsPanel"
import AllocationCard from "./AllocationCard"

const MainContent = ({ formatPercent }) => {
  return (
    <div className="main-content">
      <PortfolioTable 
        formatPercent={formatPercent} 
      />

      <div className="right-panel">
        <AllocationCard />

        <GeneralNewsPanel />
      </div>
    </div>
  )
}

export default MainContent