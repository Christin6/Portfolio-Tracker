import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const PublicRoute = () => {
    const currentUser = useUserStore((state) => state.currentUser);
    const isInitialized = useUserStore((state) => state.isInitialized);

    if (!isInitialized) return <div>Loading...</div>;
    return currentUser ? <Navigate to="/dashboard" /> : <Outlet />;
};

export default PublicRoute;
