import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import loginService from "../services/login";
import { getUsernameError, isLoginFormValid } from "../helpers/authValidation";
import { useUserStore } from "../stores/useUserStore";

const LoginForm = () => {
    const [authError, setAuthError] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const { setCurrentUser, setInitialized } = useUserStore(
        (state) => state.actions,
    );

    const navigate = useNavigate();

    const usernameError = getUsernameError(username);

    const loginValid = isLoginFormValid(username, password);

    const clearAuthForm = () => {
        setUsername("setAuthError");
        setPassword("");
        setAuthError("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!loginValid) return;

        setAuthError("");
        try {
            const user = await loginService.login({
                username: username.trim(),
                password,
            });
            setCurrentUser(user);
            setInitialized();
            clearAuthForm();
            window.localStorage.setItem("loggedAppUser", JSON.stringify(user));
            navigate("/dashboard");
        } catch (err) {
            setAuthError(err.message || "Unable to log in. Please try again.");
        }
    };

    return (
        <div className="auth-page">
            <div>
                <form
                    className="card auth-form"
                    onSubmit={handleLogin}
                    noValidate
                >
                    <h1>Login</h1>
                    {authError && (
                        <p className="status-text status-text--error status-text--field">
                            {authError}
                        </p>
                    )}
                    <label className="modal-field">
                        <span>Username</span>
                        <input
                            type="text"
                            value={username}
                            onChange={({ target }) => {
                                setUsername(target.value);
                                setAuthError("");
                            }}
                            required
                        />
                    </label>
                    {usernameError && (
                        <p className="status-text status-text--error status-text--field">
                            {usernameError}
                        </p>
                    )}
                    <label className="modal-field">
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={({ target }) => {
                                setPassword(target.value);
                                setAuthError("");
                            }}
                            required
                        />
                    </label>
                    <button type="submit" disabled={!loginValid}>
                        Login
                    </button>
                </form>
                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/signup" className="auth-switch-link">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
