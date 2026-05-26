// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "../components/layout/Layout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AuthSwitchRoute from "./AuthSwitchRoute";

import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import OtpVerify from "../pages/auth/OtpVerify";

import Dashboard from "../pages/dashboard/Dashboard";
import CardList from "../pages/cards/CardList";
import CardDetails from "../pages/cards/CardDetails";
import AddCard from "../pages/cards/AddCard";
import Transactions from "../pages/transactions/Transactions";
import Utilities from "../pages/transactions/Utilities";
import Transfer from "../pages/transactions/Transfer";
import Profile from "../pages/profile/Profile";
import Cashback from "../pages/cashback/Cashback";
import DevPanel from "../pages/dev/DevPanel";

import { CardsPreview, UtilitiesPreview, TransferPreview } from "../pages/public/Previews";

import NotFound from "../pages/notfound/NotFound";

const AppRouter = () => {
    return (
        <Routes>
            {/* All routes share the same Layout (Header/Footer + theme toggle) */}
            <Route element={<Layout />}>
                {/* Public-only */}
                <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/otp/verify" element={<PublicRoute><OtpVerify /></PublicRoute>} />

                {/* Protected */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/cards/add" element={<ProtectedRoute><AddCard /></ProtectedRoute>} />
                <Route path="/cards/:id" element={<ProtectedRoute><CardDetails /></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/cashback" element={<ProtectedRoute><Cashback /></ProtectedRoute>} />
                <Route path="/dev" element={<ProtectedRoute><DevPanel /></ProtectedRoute>} />

                {/* Public previews (guest) + real pages (authed) */}
                <Route
                    path="/cards"
                    element={<AuthSwitchRoute authed={<CardList />} guest={<CardsPreview />} />}
                />
                <Route
                    path="/utilities"
                    element={<AuthSwitchRoute authed={<Utilities />} guest={<UtilitiesPreview />} />}
                />
                <Route
                    path="/transfer"
                    element={<AuthSwitchRoute authed={<Transfer />} guest={<TransferPreview />} />}
                />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
};

export default AppRouter;
