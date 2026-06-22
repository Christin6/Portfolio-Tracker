import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const ProtectedRoute = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  const isInitialized = useUserStore((state) => state.isInitialized);

  if (!isInitialized) return null; // or a spinner
  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
