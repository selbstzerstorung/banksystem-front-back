// src/router/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // Пока проверяется auth
    if (loading) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "80px",
                opacity: 0.6
            }}>
                Loading...
            </div>
        );
    }

    // Если уже залогинен → на Dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default PublicRoute;
