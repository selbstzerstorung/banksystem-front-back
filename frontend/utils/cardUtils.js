// src/utils/cardUtils.js

export const CARD_SCHEMES = ["visa", "mastercard"];
export const CARD_CURRENCIES = ["AZN", "USD", "RUB", "EURO"];

const randomDigit = () => Math.floor(Math.random() * 10);

export const generateCardNumber = (scheme = "visa") => {
    const s = scheme.toLowerCase();
    const firstDigit = s === "mastercard" ? "5" : "4";

    let digits = firstDigit;
    while (digits.length < 16) {
        digits += randomDigit().toString();
    }

    // формат XXXX XXXX XXXX XXXX
    return digits.replace(/(.{4})/g, "$1 ").trim();
};

export const generateCvv = () => {
    let cvv = "";
    while (cvv.length < 3) {
        cvv += randomDigit().toString();
    }
    return cvv;
};

export const generateExpiryPlusYears = (years = 3) => {
    const now = new Date();
    now.setFullYear(now.getFullYear() + years);

    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);

    return `${mm}/${yy}`;
};
