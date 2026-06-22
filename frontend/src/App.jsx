import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

import userStockService from "./services/userStock";

import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";

import { useUserStore } from "./stores/useUserStore";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60,
    },
  },
});

function App() {
  const { setCurrentUser, setInitialized } = useUserStore(
    (state) => state.actions,
  );

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setCurrentUser(user);
      userStockService.setToken(user.token);
      setInitialized();
    }
  }, [setCurrentUser, setInitialized]);

  const isInitialized = useUserStore((state) => state.isInitialized);
  const currentUser = useUserStore((state) => state.currentUser);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route
          path="*"
          element={
            !isInitialized ? null : currentUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
