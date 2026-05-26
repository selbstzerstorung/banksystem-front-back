import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { EMPLOYMENT_STATUS, STORAGE_KEYS } from "../utils/constants";

const UserContext = createContext(null);

const readStoredUser = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export const UserProvider = ({ children }) => {
    // Migrate the old key (if present) -> the new key.
    // This prevents "logged out after update" when we rename storage keys.
    try {
        const oldKey = "Santa_current_user";
        const newKey = STORAGE_KEYS.CURRENT_USER; // chimichanga_current_user

        const oldVal = localStorage.getItem(oldKey);
        const newVal = localStorage.getItem(newKey);

        if (oldVal && !newVal) {
            localStorage.setItem(newKey, oldVal);
        }

        if (oldVal) {
            localStorage.removeItem(oldKey);
        }
    } catch {
        // ignore
    }

    // Cleanup legacy keys that may exist from older builds / experiments.
    // Keeps the app state predictable: one key for the current user.
    useEffect(() => {
        try {
            localStorage.removeItem(STORAGE_KEYS.USERS); // Santa_users

            // legacy aliases
            localStorage.removeItem("bank_user");
            localStorage.removeItem("chim_user");
            localStorage.removeItem("Santa_user");
            localStorage.removeItem("user");
            localStorage.removeItem("current_user");

            // legacy/demo token key (if present)
            localStorage.removeItem("bank_access_token");
        } catch {
            // ignore
        }
    }, []);

    const [user, setUser] = useState(readStoredUser);

    const readEmploymentMap = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEYS.EMPLOYMENT_BY_USER);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    };

    const writeEmploymentMap = (map) => {
        try {
            localStorage.setItem(STORAGE_KEYS.EMPLOYMENT_BY_USER, JSON.stringify(map || {}));
        } catch {
            // ignore
        }
    };

    const deriveEmploymentFromSalary = (salary) => {
        const s = Number(salary || 0);
        return Number.isFinite(s) && s > 0 ? EMPLOYMENT_STATUS.EMPLOYED : EMPLOYMENT_STATUS.UNEMPLOYED;
    };

    const [employmentStatus, setEmploymentStatusState] = useState(() => {
        const u = readStoredUser();
        if (!u?.id) return deriveEmploymentFromSalary(u?.salary);
        const map = readEmploymentMap();
        return map?.[String(u.id)] || deriveEmploymentFromSalary(u?.salary);
    });

    const updateUser = (data) => {
        setUser(data);
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(data));

        // If this is a new login, make sure we have a stable employmentStatus.
        // If it was never set for this user, derive it from salary once.
        if (data?.id != null) {
            const map = readEmploymentMap();
            const key = String(data.id);
            if (!map?.[key]) {
                const derived = deriveEmploymentFromSalary(data?.salary);
                map[key] = derived;
                writeEmploymentMap(map);
                setEmploymentStatusState(derived);
            }
        }
    };

    const clearUser = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    };

    useEffect(() => {
        // Keep employmentStatus in sync when user changes (login/logout).
        if (!user?.id) {
            setEmploymentStatusState(EMPLOYMENT_STATUS.UNEMPLOYED);
            return;
        }
        const map = readEmploymentMap();
        const key = String(user.id);
        const next = map?.[key] || deriveEmploymentFromSalary(user?.salary);
        setEmploymentStatusState(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const setEmploymentStatus = (nextStatus) => {
        if (!user?.id) return;
        const next = nextStatus === EMPLOYMENT_STATUS.EMPLOYED ? EMPLOYMENT_STATUS.EMPLOYED : EMPLOYMENT_STATUS.UNEMPLOYED;
        const map = readEmploymentMap();
        map[String(user.id)] = next;
        writeEmploymentMap(map);
        setEmploymentStatusState(next);
    };

    const value = useMemo(
        () => ({
            user,
            updateUser,
            clearUser,
            employmentStatus,
            isEmployed: employmentStatus === EMPLOYMENT_STATUS.EMPLOYED,
            setEmploymentStatus,
        }),
        [user, employmentStatus]
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
