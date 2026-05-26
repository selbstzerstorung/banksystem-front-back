// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { bankApi } from "../api/bankApi";
import { STORAGE_KEYS } from "../utils/constants";

export const AuthContext = createContext(null);

const normalizeUser = (raw) => {
    const u = raw?.user ?? raw ?? {};

    const id = u.userId ?? u.id ?? u.user_id ?? null;

    const name = u.userName ?? u.user_name ?? u.name ?? "";
    const surname = u.userSurname ?? u.user_surname ?? u.surname ?? "";
    const email = u.userEmail ?? u.user_email ?? u.email ?? "";
    const phone = u.userPhoneNumber ?? u.user_phone_number ?? u.phone ?? "";

    const birthday = u.userBirthday ?? u.user_birthday ?? u.birthday ?? "";

    const salaryRaw = u.userSalary ?? u.user_salary ?? u.salary ?? 0;
    const salary = Number(salaryRaw || 0);

    return {
        id,
        name,
        surname,
        email,
        phone,
        birthday,
        salary,
        employment: salary > 0,
    };
};

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const { user, updateUser, clearUser } = useUser();

    const [authLoading, setAuthLoading] = useState(false);
    const [error, setError] = useState("");
    const [sessionReady, setSessionReady] = useState(false);

    const isAuthenticated = Boolean(user?.id);

    useEffect(() => {
        // Backend has no refresh-token session. We simply rely on localStorage user.
        setSessionReady(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const register = async (registrationPayload) => {
        setAuthLoading(true);
        setError("");

        try {
            // 1) Create user
            const res = await bankApi.register(registrationPayload);

            // 2) Send OTP (email verification)
            const email = registrationPayload?.user_email;
            if (email) {
                await bankApi.otpSend({ email });
                try {
                    localStorage.setItem(STORAGE_KEYS.PENDING_OTP_EMAIL, String(email));
                } catch {
                    // ignore
                }
            }

            // Do NOT mark user as authenticated until OTP is verified + login happens.
            // We only return success and let UI redirect to /otp/verify.
            return { success: true, user: normalizeUser(res), email };
        } catch (e) {
            console.error("[AuthContext] register error", e);
            setError(e?.message || "Registration failed.");
            return { success: false };
        } finally {
            setAuthLoading(false);
        }
    };

    const login = async (email, password, options = {}) => {
        setAuthLoading(true);
        setError("");

        try {
            const res = await bankApi.login({ email, password });
            updateUser(normalizeUser(res));
            setSessionReady(true);
            const redirectTo = options?.redirectTo || "/dashboard";
            navigate(redirectTo, { replace: Boolean(options?.replace) });
            return { success: true };
        } catch (e) {
            console.error("[AuthContext] login error", e);
            setError(e?.message || "Login failed.");
            clearUser();
            setSessionReady(true);
            return { success: false };
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = () => {
        clearUser();
        setSessionReady(true);
        navigate("/login");
    };

    const value = useMemo(
        () => ({
            user,
            isAuthenticated,
            authLoading,
            loading: !sessionReady || authLoading,
            sessionReady,
            error,
            register,
            login,
            logout,
        }),
        [user, isAuthenticated, authLoading, sessionReady, error]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
