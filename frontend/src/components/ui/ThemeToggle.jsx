// src/components/ui/ThemeToggle.jsx
import React from "react";
import { Moon, Sun } from "lucide-react";
import styled from "styled-components";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useNotifications } from "../../contexts/NotificationContext";

const ToggleBtn = styled.button`
    border-radius: 999px;
    border: 1px solid ${({ theme }) => theme.borders.color};
    background: ${({ theme }) => theme.background.secondary};
    padding: 6px 10px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`;

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeContext();
    const notifications = useNotifications();

    const onToggle = () => {
        const res = toggleTheme?.();
        if (res?.enteredSanta) {
            notifications?.pushInfo?.("Ho-ho-ho! Santa Theme unlocked 🎄", "Easter egg");
        }
    };
    return (
        <ToggleBtn type="button" onClick={onToggle} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </ToggleBtn>
    );
};

export default ThemeToggle;
