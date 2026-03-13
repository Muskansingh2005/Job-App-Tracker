import { createContext, useContext, useMemo, useState } from "react";
import { loginUser, registerUser } from "../api/auth.js";

const AuthContext = createContext(null);

const getStoredUser = () => {
    const user = localStorage.getItem("applyflow_user");
    return user ? JSON.parse(user) : null;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser());
    const [token, setToken] = useState(localStorage.getItem("applyflow_token"));

    const setAuth = (authData) => {
        setUser(authData.user);
        setToken(authData.token);
        localStorage.setItem("applyflow_user", JSON.stringify(authData.user));
        localStorage.setItem("applyflow_token", authData.token);
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("applyflow_user");
        localStorage.removeItem("applyflow_token");
    };

    const register = async (payload) => {
        const data = await registerUser(payload);
        setAuth(data);
    };

    const login = async (payload) => {
        const data = await loginUser(payload);
        setAuth(data);
    };

    const value = useMemo(
        () => ({ user, token, login, register, logout: clearAuth }),
        [user, token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};
