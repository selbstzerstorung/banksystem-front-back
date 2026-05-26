// src/pages/transactions/Transactions.jsx
import React, { useEffect, useMemo, useState } from "react";
import Typography from "../../components/ui/Typography";
import { useTransactions } from "../../contexts/TransactionsContext";
import { useCards } from "../../contexts/CardsContext";

import {
    Wrapper,
    Tabs,
    Tab,
    List,
    Item,
    Amount,
    Meta,
} from "./Transactions.styles";

const Transactions = () => {
    const { transactions, recent, loading, error, refreshRecent, refreshCardTransactions } = useTransactions();
    const { currentCardId } = useCards() || {};

    const [mode, setMode] = useState("all"); // all = recent by user, card = by current card

    useEffect(() => {
        // Ensure data is loaded for the selected mode.
        // (Context also preloads, but this avoids "empty view" surprises.)
        if (mode === "all") refreshRecent?.();
        if (mode === "card") refreshCardTransactions?.(currentCardId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, currentCardId]);

    const list = useMemo(() => {
        const a = Array.isArray(recent) ? recent : [];
        const b = Array.isArray(transactions) ? transactions : [];
        return mode === "all" ? a : b;
    }, [mode, recent, transactions]);

    const fmtDate = (value) => {
        if (!value) return "—";
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
    };

    return (
        <Wrapper>
            <div>
                <Typography as="h1" size="xl" weight="bold">
                    Transactions
                </Typography>
                <Typography size="sm" style={{ opacity: 0.7, marginTop: 6 }}>
                    {mode === "all"
                        ? "All recent transactions for your account"
                        : "Transactions for the selected card"}
                </Typography>
            </div>

            <Tabs>
                <Tab $active={mode === "all"} onClick={() => setMode("all")}>All</Tab>
                <Tab $active={mode === "card"} onClick={() => setMode("card")}>Current card</Tab>
            </Tabs>

            <List>
                {list.map((tx, idx) => {
                    const signed = Number(tx?.signedAmount ?? 0);
                    const currency = tx?.currency || "AZN";
                    const amount = Math.abs(signed || Number(tx?.amount || 0));
                    return (
                    <Item key={tx?.id ?? tx?.raw?.id ?? `${tx?.type}-${tx?.date}-${idx}`}>
                        <Meta>
                            <span>{tx.description || tx.type}</span>
                            <span>{fmtDate(tx.date)}</span>
                        </Meta>
                        <Amount $positive={signed >= 0}>
                            {signed < 0 ? "-" : signed > 0 ? "+" : ""}
                            {amount.toFixed(2)} {currency}
                        </Amount>
                    </Item>
                );})}

                {loading && (
                    <Typography size="sm" color="muted">
                        Loading...
                    </Typography>
                )}

                {error && (
                    <Typography size="sm" color="danger">
                        {error}
                    </Typography>
                )}

                {list.length === 0 && !loading && (
                    <Typography size="sm" color="muted">
                        {mode === "all"
                            ? "No recent transactions yet."
                            : "No transactions for this card yet."}
                    </Typography>
                )}
            </List>
        </Wrapper>
    );
};

export default Transactions;
