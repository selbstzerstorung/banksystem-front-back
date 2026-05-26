// src/utils/constants.js
export const STORAGE_KEYS = {
    USERS: "Santa_users",
    // Single source of truth for the currently authenticated user
    CURRENT_USER: "chimichanga_current_user",
    // During registration we store the email here to verify OTP.
    PENDING_OTP_EMAIL: "chimichanga_pending_otp_email",
    // Temporary (session) storage used to auto-login right after OTP verification.
    // NOTE: We store this in sessionStorage (not localStorage) and clear after verify.
    PENDING_OTP_PASSWORD: "chimichanga_pending_otp_password",
    // Dashboard-selected card (optional)
    CURRENT_CARD_ID: "chimichanga_current_card_id",
    // Employment status is a frontend-only preference (safe fallback).
    // We store a map: { [userId]: "EMPLOYED" | "UNEMPLOYED" }
    EMPLOYMENT_BY_USER: "chimichanga_employment_by_user",
    CARDS: "Santa_cards",
    CARDS_META: "Santa_cards_meta",
    TRANSACTIONS: "Santa_transactions",
    THEME: "Santa_theme",
    // Used to restore the previous (light/dark) theme after exiting the Santa easter-egg theme.
    THEME_PREV: "Santa_theme_prev",
    // Santa garland: warm-white mode toggle (header easter-egg).
    SANTA_GARLAND_WARM: "Santa_santa_garland_warm",
};

export const EMPLOYMENT_STATUS = {
    EMPLOYED: "EMPLOYED",
    UNEMPLOYED: "UNEMPLOYED",
};

// Card limits based on employment status.
// Note: UNEMPLOYED users may still *have* an existing credit card from the past,
// but they cannot create new credit cards. Total cap remains 4 to allow that legacy credit.
export const CARD_LIMITS = {
    [EMPLOYMENT_STATUS.EMPLOYED]: { total: 4, debit: 3, credit: 1 },
    [EMPLOYMENT_STATUS.UNEMPLOYED]: { total: 4, debit: 3, credit: 0 },
};
