import "react-toastify/dist/ReactToastify.css";
import "./Dashboard.css";

import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
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
        fetch("/api/auth/me", { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((user) => {
                if (user) {
                    setCurrentUser(user);
                }
                setInitialized();
            });
    }, [setCurrentUser, setInitialized]);

    const isInitialized = useUserStore((state) => state.isInitialized);
    const currentUser = useUserStore((state) => state.currentUser);

    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/signup" element={<SignupForm />} />
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                </Route>
                <Route
                    path="/"
                    element={
                        !isInitialized ? (
                            <div>Loading...</div> // wait for fetch
                        ) : currentUser ? (
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
