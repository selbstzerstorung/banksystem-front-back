// src/router/AuthSwitchRoute.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Renders `authed` when user is authenticated, otherwise renders `guest`.
 * Used for public previews (Cards/Utilities/Transfer) instead of hard redirect to /login.
 */
const AuthSwitchRoute = ({ authed, guest }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "80px",
                    opacity: 0.6,
                }}
            >
                Loading...
            </div>
        );
    }

    return isAuthenticated ? authed : guest;
};

export default AuthSwitchRoute;
