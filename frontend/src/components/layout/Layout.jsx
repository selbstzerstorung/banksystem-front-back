// src/components/layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { LayoutWrapper, Main } from "./Layout.styles";

const Layout = () => {
    return (
        <LayoutWrapper>
            <Header />
            <Main>
                <Outlet />
            </Main>
            <Footer />
        </LayoutWrapper>
    );
};

export default Layout;
