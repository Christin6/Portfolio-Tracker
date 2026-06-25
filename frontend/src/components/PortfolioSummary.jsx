import { usePortfolioTotals } from "../hooks/useUserStocks";
import { useCurrentCurrency } from "../stores/useCurrencyStore";
import { formatCurrency } from "../helpers/formatCurrency";

const PortfolioSummary = ({ formatPercent }) => {
    const { totalValue, totalCost, totalPL, totalPLPercent } =
        usePortfolioTotals();
    const currentCurrency = useCurrentCurrency();

    return (
        <div className="portfolio-summary">
            <div className="card summary-card">
                <h3>Total Value</h3>
                <p>{formatCurrency(totalValue, currentCurrency)}</p>
            </div>
            <div className="card summary-card">
                <h3>Total Cost</h3>
                <p>{formatCurrency(totalCost, currentCurrency)}</p>
            </div>
            <div className="card summary-card">
                <h3>Total P/L</h3>
                <p className={totalPL >= 0 ? "profit" : "loss"}>
                    {formatCurrency(totalPL, currentCurrency)}
                </p>
            </div>
            <div className="card summary-card">
                <h3>P/L %</h3>
                <p className={totalPLPercent >= 0 ? "profit" : "loss"}>
                    {formatPercent(totalPLPercent)}
                </p>
            </div>
        </div>
    );
};

export default PortfolioSummary;
