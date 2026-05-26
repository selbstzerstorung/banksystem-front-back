// src/styles/themes.js

export const lightTheme = {
    name: "light",
    background: {
        primary: "#ffffff",
        secondary: "#f5f7fa",
        card: "#ffffff",
    },
    text: {
        primary: "#111111",
        secondary: "#555555",
        muted: "#777777",
    },

    // ---- SPACING (используется sm / lg в стилях) ----
    spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "32px",
    },

    // ---- BORDER RADIUS ----
    radius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
    },

    // ---- SHADOWS ----
    shadows: {
        sm: "0 1px 3px rgba(15, 23, 42, 0.08)",
        md: "0 4px 12px rgba(15, 23, 42, 0.12)",
        lg: "0 10px 30px rgba(15, 23, 42, 0.16)",
    },

    // ---- BRAND COLORS ----
    primary: {
        50: "#eef5ff",
        100: "#d9e7ff",
        300: "#7db1ff",
        500: "#3d8bff",
        600: "#2c72e9",
    },

    borders: {
        color: "#e5e7eb",
        // subtle is used across UI components as a softer border tone
        subtle: "#e5e7eb",
    },

    status: {
        error: "#dc2626",
        success: "#16a34a",
    },

    // ---- HEADER / FOOTER ----
    header: {
        bg: "#ffffff",
        border: "#e5e7eb",
    },
    footer: {
        bg: "#f5f7fa",
        text: "#777777",
    },
};

export const darkTheme = {
    name: "dark",
    background: {
        primary: "#111111",
        secondary: "#1a1a1a",
        card: "#1b1b1b",
    },
    text: {
        primary: "#ffffff",
        secondary: "#cccccc",
        muted: "#888888",
    },

    spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "32px",
    },

    radius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
    },

    shadows: {
        sm: "0 1px 3px rgba(0, 0, 0, 0.4)",
        md: "0 4px 12px rgba(0, 0, 0, 0.5)",
        lg: "0 10px 30px rgba(0, 0, 0, 0.6)",
    },

    primary: {
        50: "#1a1f2e",
        100: "#24304a",
        300: "#4467a8",
        500: "#3d8bff",
        600: "#66a3ff",
    },

    borders: {
        color: "#333333",
        // subtle is used across UI components as a softer border tone
        subtle: "#333333",
    },

    status: {
        error: "#f87171",
        success: "#4ade80",
    },

    header: {
        bg: "#1b1b1b",
        border: "#2a2a2a",
    },
    footer: {
        bg: "#111111",
        text: "#777777",
    },
};

// Hidden easter-egg theme: unlocked by rapidly toggling the theme 5 times within 3 seconds.
export const santaTheme = {
    name: "santa",
    background: {
        // Deep evergreen / blue-green (near-black) + slightly lighter secondary
        primary: "#071314",
        secondary: "#0B1D1D",
        card: "#0E2423",
    },
    text: {
        primary: "#F8F5EF", // warm white
        secondary: "#D7D0C6",
        muted: "#A99F92",
    },

    spacing: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "32px",
    },

    radius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
    },

    shadows: {
        // a slightly warmer, deeper shadow while keeping the same API shape
        sm: "0 2px 8px rgba(0, 0, 0, 0.45)",
        md: "0 10px 24px rgba(0, 0, 0, 0.55)",
        lg: "0 18px 44px rgba(0, 0, 0, 0.65)",
    },

    // Primary is used across UI (buttons, active nav). In Santa theme it becomes festive red.
    primary: {
        50: "#2B1212",
        100: "#3A1515",
        300: "#8B2D2D",
        500: "#C81E1E", // Christmas red
        600: "#A51616",
    },

    borders: {
        color: "rgba(248, 245, 239, 0.14)",
        subtle: "rgba(248, 245, 239, 0.10)",
    },

    status: {
        error: "#FF6B6B",
        success: "#22C55E", // festive green
    },

    // Optional accent tokens (safe addition; components may ignore them)
    accent: {
        primary: "#C81E1E",
        success: "#22C55E",
        gold: "#D4AF37",
    },

    header: {
        bg: "#0B1D1D",
        border: "rgba(248, 245, 239, 0.12)",
    },
    footer: {
        bg: "#071314",
        text: "#A99F92",
    },
};
