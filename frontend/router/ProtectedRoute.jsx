// src/router/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Пока проверяется auth — НИЧЕГО НЕ РЕНДЕРИМ
    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "80px",
                opacity: 0.6
            }}>
                Checking authentication...
            </div>
        );
    }

    // Если пользователь НЕ авторизован
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Если авторизован — пропускаем
    return children;
};

export default ProtectedRoute;
