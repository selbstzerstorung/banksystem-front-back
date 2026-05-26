// src/utils/cardGuards.js
// Small helpers to keep card-type logic consistent across the app.

export const CARD_TYPES = {
  DEBIT: "debit",
  CREDIT: "credit",
  CASHBACK: "cashback",
  UNKNOWN: "unknown",
};

export const getType = (obj) => String(obj?.type || "").toLowerCase();

export const isPaymentCard = (obj) => {
  const t = getType(obj);
  return t === CARD_TYPES.DEBIT || t === CARD_TYPES.CREDIT;
};

export const isCashbackCard = (obj) => getType(obj) === CARD_TYPES.CASHBACK;

// Backend details responses:
// - Debit:   { cardId, balance, ppn, currency, cvv, expiry_date/expiryDate, status }
// - Credit:  { cardId, balance, ppn, currency, expiryDate, status, loanAmount, interestRate }
// - Cashback: { cardId, balance }
export const isCashbackDetails = (details) => {
  if (!details || typeof details !== "object") return false;

  const hasAny = (keys) => keys.some((k) => details?.[k] != null);

  const hasDebitMarkers = hasAny(["cvv", "d_cvv", "expiry_date", "d_expiry_date", "expiryDate"]);
  const hasCreditMarkers = hasAny(["loanAmount", "c_loan_amount", "interestRate", "c_interest_rate"]);
  const hasCommonMarkers = hasAny(["currency", "d_currency", "c_currency", "status", "d_status", "c_status", "ppn", "d_ppn", "c_ppn"]);

  // Cashback details (in this backend) are extremely minimal.
  // If we see any debit/credit markers — it's NOT cashback.
  if (hasDebitMarkers || hasCreditMarkers || hasCommonMarkers) return false;

  // Must at least have id + balance to be considered cashback.
  const id = details.cardId ?? details.card_id ?? details.id;
  const bal = details.balance ?? details.amount;
  return id != null && bal != null;
};

export const calcCreditDebt = ({ loanAmount, balance }) => {
  const limit = Number(loanAmount || 0);
  const available = Number(balance || 0);
  if (!Number.isFinite(limit) || limit <= 0) return 0;
  const debt = limit - (Number.isFinite(available) ? available : 0);
  return Math.max(0, debt);
};

export const calcCreditUsagePercent = ({ loanAmount, balance }) => {
  const limit = Number(loanAmount || 0);
  if (!Number.isFinite(limit) || limit <= 0) return 0;
  const debt = calcCreditDebt({ loanAmount: limit, balance });
  return Math.min(100, Math.max(0, (debt / limit) * 100));
};
