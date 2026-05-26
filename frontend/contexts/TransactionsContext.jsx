// src/contexts/TransactionsContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { bankApi } from "../api/bankApi";
import { useUser } from "./UserContext";
import { useCards } from "./CardsContext";

export const TransactionsContext = createContext(null);

const safeNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const normalizeTransaction = (raw, myCardIdsSet) => {
  if (!raw) return null;
  // Backend TransactionResponse:
  // { id, senderId, receiverId, type, amount, convertedAmount, senderCurrency, receiverCurrency, date }
  const id = raw.id ?? raw.transactionId ?? raw.transaction_id;
  const senderId = raw.senderId ?? raw.sender_id ?? null;
  const receiverId = raw.receiverId ?? raw.receiver_id ?? null;
  const amount = safeNum(raw.amount, 0);
  const convertedAmount = raw.convertedAmount != null ? safeNum(raw.convertedAmount, 0) : null;
  const type = raw.type ?? raw.transactionType ?? "UNKNOWN";
  const createdAt = raw.date ?? raw.createdAt ?? raw.created_at ?? null;

  // Sign logic:
  // - If sender is one of my cards => negative
  // - Else if receiver is one of my cards => positive
  // - Else neutral
  const senderKey = senderId != null ? String(senderId) : "";
  const receiverKey = receiverId != null ? String(receiverId) : "";
  const isOut = myCardIdsSet?.has(senderKey);
  const isIn = myCardIdsSet?.has(receiverKey);
  const signedAmount = isOut && !isIn ? -amount : isIn && !isOut ? amount : 0;

  const currency =
    signedAmount < 0
      ? (raw.senderCurrency || raw.receiverCurrency || "AZN")
      : signedAmount > 0
        ? (raw.receiverCurrency || raw.senderCurrency || "AZN")
        : (raw.senderCurrency || raw.receiverCurrency || "AZN");

  return {
    id: id != null ? Number(id) : null,
    senderId,
    receiverId,
    amount,
    signedAmount,
    convertedAmount,
    currency,
    type: String(type),
    date: createdAt,
    description: raw.description || raw.message || "",
    raw,
  };
};

export const TransactionsProvider = ({ children }) => {
  const { user } = useUser();
  // IMPORTANT: transactions context must not treat cashback as a normal card.
  const { paymentCards: cards = [], currentCardId } = useCards();
  const userId = user?.id;

  const [transactions, setTransactions] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const myCardIdsSet = useMemo(() => {
    const set = new Set();
    for (const c of cards || []) {
      if (c?.id != null) set.add(String(c.id));
    }
    return set;
  }, [cards]);

  const refreshCardTransactions = async (cardId) => {
    const id = cardId ?? currentCardId;
    if (!id) {
      setTransactions([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const list = await bankApi.getCardTransactions({ cardId: id });
      const normalized = (Array.isArray(list) ? list : [])
        .map((x) => normalizeTransaction(x, myCardIdsSet))
        .filter(Boolean);
      setTransactions(normalized);
    } catch (e) {
      setError(e?.message || "Failed to load transactions");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshRecent = async () => {
    if (!userId) {
      setRecent([]);
      return;
    }
    try {
      const list = await bankApi.getRecentTransactions({ userId });
      const normalized = (Array.isArray(list) ? list : [])
        .map((x) => normalizeTransaction(x, myCardIdsSet))
        .filter(Boolean);
      setRecent(normalized);
    } catch {
      setRecent([]);
    }
  };

  useEffect(() => {
    refreshRecent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, myCardIdsSet]);

  useEffect(() => {
    refreshCardTransactions(currentCardId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCardId, myCardIdsSet]);

  const totals = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : [];
    let income = 0;
    let expense = 0;
    for (const tx of list) {
      const s = safeNum(tx.signedAmount, 0);
      if (s > 0) income += s;
      if (s < 0) expense += Math.abs(s);
    }
    return { income, expense };
  }, [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      recent,
      loading,
      error,
      refreshCardTransactions,
      refreshRecent,
      totalIncome: totals.income,
      totalExpense: totals.expense,
    }),
    [transactions, recent, loading, error, totals]
  );

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
