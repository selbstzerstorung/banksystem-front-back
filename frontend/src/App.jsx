// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import { ThemeContextProvider, useThemeContext } from "./contexts/ThemeContext";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CardsProvider } from "./contexts/CardsContext";
import { TransactionsProvider } from "./contexts/TransactionsContext";
import { NotificationProvider } from "./contexts/NotificationContext";

import { lightTheme, darkTheme, santaTheme } from "./styles/themes";
import GlobalStyles from "./styles/GlobalStyles";
import AppRouter from "./router/AppRouter";
import SantaSnow from "./components/layout/SantaSnow";

const AppContent = () => {
    const { theme } = useThemeContext();

    const currentTheme = theme === "santa" ? santaTheme : theme === "dark" ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={currentTheme}>
            <GlobalStyles />
            {theme === "santa" ? <SantaSnow /> : null}
            <NotificationProvider>
                <UserProvider>
                    <AuthProvider>
                        <CardsProvider>
                            <TransactionsProvider>
                                <AppRouter />
                            </TransactionsProvider>
                        </CardsProvider>
                    </AuthProvider>
                </UserProvider>
            </NotificationProvider>
        </ThemeProvider>
    );
};

const App = () => {
    return (
        <ThemeContextProvider>
            <BrowserRouter>
                <AppContent />
            </BrowserRouter>
        </ThemeContextProvider>
    );
};

export default App;
