// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { STORAGE_KEYS } from "../utils/constants";

const ThemeContext = createContext(null);

const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.THEME);
        if (stored === "dark" || stored === "light" || stored === "santa") return stored;
    } catch {
        // ignore
    }
    // fallback — системная тема
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        return "dark";
    }
    return "light";
};

export const ThemeContextProvider = ({ children }) => {
    const [theme, setTheme] = useState(getInitialTheme);

    // Keep a ref of the current theme for synchronous reads inside handlers.
    const themeRef = useRef(theme);
    useEffect(() => {
        themeRef.current = theme;
    }, [theme]);

    // Easter-egg: 5 toggles within 3 seconds unlocks Santa.
    const windowStartMsRef = useRef(0);
    const clickCountRef = useRef(0);

    const resetEasterEggWindow = () => {
        windowStartMsRef.current = 0;
        clickCountRef.current = 0;
    };

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEYS.THEME, theme);
        } catch {
            // ignore
        }
    }, [theme]);

    const toggleTheme = () => {
        const now = Date.now();
        const current = themeRef.current;

        // If we are currently in Santa theme, one click exits back to the previous light/dark theme.
        if (current === "santa") {
            let prev = "dark";
            try {
                const storedPrev = localStorage.getItem(STORAGE_KEYS.THEME_PREV);
                if (storedPrev === "dark" || storedPrev === "light") prev = storedPrev;
            } catch {
                // ignore
            }
            resetEasterEggWindow();
            setTheme(prev);
            return { exitedSanta: true };
        }

        // Maintain a strict 3-second window starting from the first click.
        if (!windowStartMsRef.current || now - windowStartMsRef.current > 3000) {
            windowStartMsRef.current = now;
            clickCountRef.current = 1;
        } else {
            clickCountRef.current += 1;
        }

        // If unlocked within the window: enter Santa and stop the normal toggle cycle.
        if (clickCountRef.current >= 5 && now - windowStartMsRef.current <= 3000) {
            try {
                localStorage.setItem(STORAGE_KEYS.THEME_PREV, current);
            } catch {
                // ignore
            }
            resetEasterEggWindow();
            setTheme("santa");
            return { enteredSanta: true };
        }

        // Normal toggle (light <-> dark)
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
        return { toggled: true };
    };

    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);
