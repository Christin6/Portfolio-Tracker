import PortfolioSummary from "./PortfolioSummary";
import MainContent from "./MainContent";
import StockSearchBar from "./StockSearchBar";

import { useQueryClient } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import { useUserStore } from "../stores/useUserStore";
import {
    toggleCurrentCurrency,
    useCurrentCurrency,
} from "../stores/useCurrencyStore";

const Dashboard = () => {
    const { setCurrentUser } = useUserStore((state) => state.actions);

    const currentCurrency = useCurrentCurrency();
    const queryClient = useQueryClient();

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        queryClient.clear();
        setCurrentUser(null);
    };

    const formatPercent = (percent) => {
        const sign = percent >= 0 ? "+" : "";
        return `${sign}${percent?.toFixed(2)}%`;
    };

    return (
        <div className="dashboard">
            <ToastContainer />

            <div className="header">
                <StockSearchBar />
                <button
                    className="currency-toggle"
                    onClick={toggleCurrentCurrency}
                >
                    {currentCurrency}
                </button>
                <button onClick={handleLogout}>Logout</button>
            </div>

            <PortfolioSummary formatPercent={formatPercent} />

            <MainContent formatPercent={formatPercent} />
        </div>
    );
};

export default Dashboard;
