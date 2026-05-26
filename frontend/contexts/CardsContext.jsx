// src/contexts/CardsContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { bankApi } from "../api/bankApi";
import { CARD_LIMITS, EMPLOYMENT_STATUS, STORAGE_KEYS } from "../utils/constants";
import {
  CARD_TYPES,
  isCashbackDetails,
  isPaymentCard,
  isCashbackCard,
} from "../utils/cardGuards";
import { useUser } from "./UserContext";

export const CardsContext = createContext(null);

const safeNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

// Pick the first non-nullish value from a list of keys.
// Helps us stay compatible with slightly different backend JSON shapes.
const pickFirst = (obj, keys) => {
  if (!obj || typeof obj !== "object") return undefined;
  for (const k of keys) {
    if (obj[k] != null) return obj[k];
  }
  return undefined;
};

const normalizeCardType = (raw) => {
  const t = String(raw || "").toLowerCase();
  if (t.includes("credit")) return "credit";
  if (t.includes("debit")) return "debit";
  // Dashboard list does not include type — we must resolve via /details.
  return CARD_TYPES.UNKNOWN;
};

const normalizeCard = (raw) => {
  if (!raw) return null;

  // Dashboard list can be an Object with different keys, so we try a wide match.
  const id = raw.cardId ?? raw.card_id ?? raw.cardID ?? raw.id ?? raw.debitCardId ?? raw.creditCardId;

  // In the current backend dashboard list (CardDashboardResponse) we only get cardId + balance.
  // There is no cardNumber field, so we use cardId as a "number" for UI (masked).
  const number = raw.cardNumber ?? raw.card_number ?? raw.number ?? raw.cardNo ?? raw.card_no ?? id ?? "";

  const currency = raw.currency ?? raw.cardCurrency ?? raw.card_currency ?? "AZN";
  const balance = safeNum(raw.balance ?? raw.availableBalance ?? raw.available_balance ?? raw.amount ?? 0);
  const status = raw.status ?? raw.cardStatus ?? raw.card_status ?? raw.blockStatus ?? raw.block_status ?? "ACTIVE";
  const type = normalizeCardType(raw.type ?? raw.cardType ?? raw.card_type);

  return {
    id: safeNum(id, null),
    number: String(number || ""),
    currency: String(currency || "AZN"),
    balance,
    status: String(status || "ACTIVE"),
    type,
    raw,
  };
};

const normalizeDetails = (raw) => {
  if (!raw) return null;

  // Cashback details are minimal in this backend: { cardId, balance }
  if (isCashbackDetails(raw)) {
    return {
      type: CARD_TYPES.CASHBACK,
      id: safeNum(raw.cardId ?? raw.card_id ?? raw.id, null),
      balance: safeNum(raw.balance ?? raw.amount ?? 0, 0),
      currency: "AZN",
      status: "ACTIVE",
    };
  }

  // The backend returns either:
  // - DebitCardDashboardDetailsResponse { cardId, balance, ppn, currency, cvv, expiry_date, status }
  // - CreditCardDashboardDetailsResponse { cardId, balance, ppn, currency, expiryDate, status, loanAmount, interestRate }

  const hasLoan =
    raw?.loanAmount != null ||
    raw?.interestRate != null ||
    raw?.loan_amount != null ||
    raw?.interest_rate != null ||
    raw?.c_loan_amount != null ||
    raw?.c_interest_rate != null;
  if (hasLoan) {
    const loanAmount = pickFirst(raw, ["loanAmount", "loan_amount", "c_loan_amount"]);
    const interestRate = pickFirst(raw, ["interestRate", "interest_rate", "c_interest_rate"]);
    return {
      type: "credit",
      id: safeNum(raw.cardId ?? raw.c_card_id ?? raw.card_id, null),
      balance: safeNum(raw.balance ?? raw.c_balance, 0),
      ppn: raw.ppn ?? raw.c_ppn,
      currency: raw.currency ?? raw.c_currency ?? "AZN",
      status: raw.status ?? raw.c_status ?? "ACTIVE",
      expiryDate: pickFirst(raw, ["expiryDate", "expiry_date", "c_expiry_date"]) ?? null,
      loanAmount,
      interestRate,
      // NOTE: most backends DO NOT return credit CVV in /details. We preserve it if provided.
      cvv: pickFirst(raw, ["cvv", "c_cvv", "cCvv", "c_cvv_number", "c_cvvNo"]),
      // NOTE: backend usually DOES NOT send currentDebt in this project.
      // Keep it undefined unless explicitly provided.
      currentDebt:
        raw.currentDebt != null || raw.c_current_debt != null || raw.current_debt != null || raw.debt != null || raw.c_debt != null
          ? safeNum(
              raw.currentDebt ?? raw.c_current_debt ?? raw.current_debt ?? raw.debt ?? raw.c_debt,
              0
            )
          : undefined,
    };
  }

  const hasCvv =
    raw?.cvv != null ||
    raw?.expiry_date != null ||
    raw?.d_cvv != null ||
    raw?.d_expiry_date != null;
  if (hasCvv) {
    return {
      type: "debit",
      id: safeNum(raw.cardId ?? raw.d_card_id ?? raw.card_id, null),
      balance: safeNum(raw.balance ?? raw.d_balance, 0),
      ppn: raw.d_ppn ?? raw.ppn,
      currency: raw.d_currency ?? raw.currency ?? "AZN",
      status: raw.d_status ?? raw.status ?? "ACTIVE",
      cvv: pickFirst(raw, ["cvv", "d_cvv", "dCvv", "d_cvv_number", "d_cvvNo"]),
      expiryDate: pickFirst(raw, ["d_expiry_date", "expiry_date", "expiryDate"]) ?? null,
    };
  }

  // Fallback
  return { type: normalizeCardType(raw.type), raw };
};

export const CardsProvider = ({ children }) => {
  const { user, employmentStatus } = useUser();
  const userId = user?.id;

  const [cards, setCards] = useState([]);
  const [cardsMeta, setCardsMeta] = useState({}); // { [cardId]: details }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentCardId, setCurrentCardId] = useState(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEYS.CURRENT_CARD_ID);
      return v ? Number(v) : null;
    } catch {
      return null;
    }
  });

  // Persist meta locally (optional)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CARDS_META, JSON.stringify(cardsMeta));
    } catch {
      // ignore
    }
  }, [cardsMeta]);

  const refresh = async () => {
    if (!userId) {
      setCards([]);
      setCardsMeta({});
      return;
    }

    setLoading(true);
    setError("");

    try {
      const list = await bankApi.getDashboardCards({ userId });
      const normalized = (Array.isArray(list) ? list : []).map(normalizeCard).filter(Boolean);
      setCards(normalized);

      // Best-effort: hydrate details for all cards (small projects, usually few cards)
      const detailsPairs = await Promise.all(
        normalized.map(async (c) => {
          try {
            const details = await bankApi.getCardDetails({ userId, cardId: c.id });
            return [c.id, normalizeDetails(details)];
          } catch {
            return [c.id, null];
          }
        })
      );

      const nextMeta = {};
      for (const [id, d] of detailsPairs) {
        if (d) nextMeta[id] = d;
      }

      // IMPORTANT:
      // - Credit card CVV is NOT returned by /details in this backend.
      // - But CVV IS returned by the card creation endpoints.
      // To let CardDetails show CVV for cards created in this app, we preserve any previously
      // stored cvv in cardsMeta (persisted in localStorage) and merge it with fresh details.
      // Use persisted meta as a fallback too (in case a card was created and the app refreshed
      // before the effect persisted cardsMeta).
      let persistedMeta = {};
      try {
        persistedMeta = JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS_META) || "{}");
      } catch {
        persistedMeta = {};
      }
      const metaBase = { ...(persistedMeta || {}), ...(cardsMeta || {}) };

      const mergedMeta = {};
      for (const c of normalized) {
        const id = c?.id;
        if (id == null) continue;
        const prev = metaBase?.[id];
        const next = nextMeta[id];
        if (!prev && !next) continue;

        const combined = { ...(prev || {}), ...(next || {}) };
        if (prev?.cvv != null && (combined.cvv == null || String(combined.cvv).trim() === "")) {
          combined.cvv = prev.cvv;
        }
        mergedMeta[id] = combined;
      }

      setCardsMeta(mergedMeta);

      // Enrich basic cards list with details (type/currency/status/expiry) for UI.
      // Dashboard list doesn't include these fields.
      const merged = normalized.map((c) => {
        const d = mergedMeta[c.id];
        if (!d) return c;
        return {
          ...c,
          // Resolve type via details; if still unknown, keep it unknown.
          type: isPaymentCard(c) ? c.type : d.type || c.type,
          currency: d.currency || c.currency,
          status: d.status || c.status,
          expires: d.expiryDate || c.expires,
          ppn: d.ppn || c.ppn,
        };
      });
      setCards(merged);

      // IMPORTANT: current selected card must NEVER be cashback.
      const paymentCards = merged.filter(isPaymentCard);
      const currentIsPayment = paymentCards.some((c) => Number(c.id) === Number(currentCardId));
      const nextCurrent = currentIsPayment ? currentCardId : (paymentCards[0]?.id ?? null);
      if (nextCurrent !== currentCardId) {
        setCurrentCardId(nextCurrent);
        try {
          if (nextCurrent == null) localStorage.removeItem(STORAGE_KEYS.CURRENT_CARD_ID);
          else localStorage.setItem(STORAGE_KEYS.CURRENT_CARD_ID, String(nextCurrent));
        } catch {
          // ignore
        }
      }
    } catch (e) {
      setError(e?.message || "Failed to load cards");
      setCards([]);
      setCardsMeta({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const setCurrentCard = async (cardId) => {
    if (!userId) return;
    const id = Number(cardId);

    // Never allow selecting cashback as the "current" card.
    const found = (cards || []).find((c) => Number(c?.id) === id);
    if (found && (isCashbackCard(found) || !isPaymentCard(found))) {
      // If user somehow tries to select cashback/unknown, just ignore.
      return;
    }

    setCurrentCardId(id);
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_CARD_ID, String(id));
    } catch {
      // ignore
    }
    // Optional backend state
    try {
      await bankApi.selectCard({ userId, cardId: id });
    } catch {
      // ignore
    }
  };

  const addCard = async ({ type, ppn, currency, loanAmount, pin }) => {
    if (!userId) throw new Error("Please login first.");
    const t = String(type || "").toLowerCase();

    // Frontend rule enforcement (backend must remain untouched).
    // This prevents bypassing UI limits via direct calls.
    const limits = CARD_LIMITS[employmentStatus] || CARD_LIMITS[EMPLOYMENT_STATUS.UNEMPLOYED];
    const list = Array.isArray(cards) ? cards.filter(isPaymentCard) : [];
    const debitCount = list.filter((c) => String(c?.type || "").toLowerCase() === "debit").length;
    const creditCount = list.filter((c) => String(c?.type || "").toLowerCase() === "credit").length;
    const totalCount = list.length;

    // Rule: if user is UNEMPLOYED and already has a CREDIT card (created earlier), it stays,
    // but NO new cards can be created.
    if (employmentStatus !== EMPLOYMENT_STATUS.EMPLOYED && creditCount > 0) {
      throw new Error("You have a credit card. While unemployed you cannot create new cards.");
    }

    if (totalCount >= (limits.total ?? 4)) {
      throw new Error(`Card limit reached (max ${limits.total ?? 4}).`);
    }

    if (t === "credit") {
      if (employmentStatus !== EMPLOYMENT_STATUS.EMPLOYED) {
        throw new Error("Credit cards are available only for employed users.");
      }
      if (creditCount >= (limits.credit ?? 1)) {
        throw new Error("You already have a credit card.");
      }
    } else {
      if (debitCount >= (limits.debit ?? 3)) {
        throw new Error(`You can have up to ${limits.debit ?? 3} debit cards.`);
      }
    }

    if (t === "credit") {
      const resp = await bankApi.createCreditCard({ userId, ppn, currency, loanAmount, pin });
      const createdId = safeNum(resp?.cardId ?? resp?.card_id ?? resp?.id, null);

      // Persist CVV from create response (credit /details does not return it).
      if (createdId != null) {
        const cvv = pickFirst(resp, ["cvv", "c_cvv", "cCvv", "c_cvv_number", "c_cvvNo"]);
        const expiryDate = pickFirst(resp, ["expiryDate", "expiry_date", "expiry"]);

        setCardsMeta((prev) => {
          const prevEntry = prev?.[createdId] || {};
          return {
            ...prev,
            [createdId]: {
              ...prevEntry,
              type: "credit",
              id: createdId,
              ppn: ppn ?? prevEntry.ppn,
              currency: currency ?? prevEntry.currency,
              status: resp?.status ?? prevEntry.status,
              loanAmount: resp?.loanAmount ?? loanAmount ?? prevEntry.loanAmount,
              interestRate: resp?.interestRate ?? prevEntry.interestRate,
              expiryDate: expiryDate ?? prevEntry.expiryDate,
              cvv: cvv ?? prevEntry.cvv,
            },
          };
        });
      }
    } else {
      const resp = await bankApi.createDebitCard({ userId, ppn, currency, pin });
      const createdId = safeNum(resp?.cardId ?? resp?.card_id ?? resp?.id, null);

      // Debit /details DOES return CVV, but we also store it from create response to avoid flicker.
      if (createdId != null) {
        const cvv = pickFirst(resp, ["cvv", "d_cvv", "dCvv", "d_cvv_number", "d_cvvNo"]);
        const expiryDate = pickFirst(resp, ["expiryDate", "expiry_date", "expiry"]);
        setCardsMeta((prev) => {
          const prevEntry = prev?.[createdId] || {};
          return {
            ...prev,
            [createdId]: {
              ...prevEntry,
              type: "debit",
              id: createdId,
              ppn: ppn ?? prevEntry.ppn,
              currency: currency ?? prevEntry.currency,
              status: resp?.status ?? prevEntry.status,
              expiryDate: expiryDate ?? prevEntry.expiryDate,
              cvv: cvv ?? prevEntry.cvv,
            },
          };
        });
      }
    }
    await refresh();
  };

  const block = async (cardId) => {
    if (!userId) return;
    await bankApi.blockCard({ userId, cardId });
    await refresh();
  };

  const unlock = async (cardId) => {
    if (!userId) return;
    await bankApi.unlockCard({ userId, cardId });
    await refresh();
  };

  const resetPin = async ({ cardId, pin, codeword, newPin }) => {
    if (!userId) throw new Error("Please login first.");
    const okPin = await bankApi.resetPinCheckPin({ userId, cardId, pin });
    if (!okPin) throw new Error("Wrong current PIN.");
    const okCode = await bankApi.resetPinCheckCodeword({ userId, cardId, codeword });
    if (!okCode) throw new Error("Wrong codeword.");
    await bankApi.resetPinUpdatePin({ userId, cardId, newPin });
    await refresh();
  };

  const totalBalance = useMemo(() => {
    // Keep backward-compatible name: totalBalance = sum of PAYMENT cards only.
    return (cards || []).filter(isPaymentCard).reduce((sum, c) => sum + safeNum(c.balance, 0), 0);
  }, [cards]);

  const paymentCards = useMemo(() => (cards || []).filter(isPaymentCard), [cards]);
  const cashbackCard = useMemo(() => (cards || []).find(isCashbackCard) || null, [cards]);

  const value = useMemo(
    () => ({
      cards,
      paymentCards,
      cashbackCard,
      cardsMeta,
      currentCardId,
      setCurrentCard,
      totalBalance,
      loading,
      error,
      refresh,
      addCard,
      block,
      unlock,
      resetPin,
    }),
    [cards, paymentCards, cashbackCard, cardsMeta, currentCardId, totalBalance, loading, error]
  );

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
};

export const useCards = () => useContext(CardsContext);
