// src/contexts/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import Toaster from "../components/ui/Toaster";

const NotificationContext = createContext(null);

let idCounter = 1;

export const NotificationProvider = ({ children }) => {
    const [items, setItems] = useState([]);

    const push = useCallback((type, message, title) => {
        const id = idCounter++;
        const item = { id, type, title: title || "Notification", message };
        setItems((prev) => [...prev, item]);

        // автоудаление через 4 секунды
        setTimeout(() => {
            setItems((prev) => prev.filter((n) => n.id !== id));
        }, 4000);
    }, []);

    const remove = (id) => {
        setItems((prev) => prev.filter((n) => n.id !== id));
    };

    const value = {
        items,
        pushSuccess: (msg, title) => push("success", msg, title || "Success"),
        pushError: (msg, title) => push("error", msg, title || "Error"),
        pushInfo: (msg, title) => push("info", msg, title || "Info"),
        pushWarning: (msg, title) => push("warning", msg, title || "Warning"),
        remove,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <Toaster items={items} onRemove={remove} />
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);
