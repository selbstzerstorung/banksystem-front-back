// src/pages/cards/CardList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useCards } from "../../contexts/CardsContext";
import { useTransactions } from "../../contexts/TransactionsContext";
import { useUser } from "../../contexts/UserContext";
import { CARD_LIMITS, EMPLOYMENT_STATUS } from "../../utils/constants";

import CardsCarousel from "./CardsCarousel";

import {
    Wrapper,
    Title,
    HeaderRow,
    AddCardButton,
    TxList,
    TxItem,
    TxLeft,
    TxRight
} from "./CardList.styles";

const CardList = () => {
    const navigate = useNavigate();
    const { paymentCards = [] } = useCards();
    const { recent } = useTransactions();
    const { employmentStatus, isEmployed } = useUser();

    const list = Array.isArray(paymentCards) ? paymentCards : [];
    const totalCount = list.length;
    const debitCount = list.filter((c) => String(c?.type || "").toLowerCase() === "debit").length;
    const creditCount = list.filter((c) => String(c?.type || "").toLowerCase() === "credit").length;

    const limits = CARD_LIMITS[employmentStatus] || CARD_LIMITS[EMPLOYMENT_STATUS.UNEMPLOYED];

    // Rule: if user is UNEMPLOYED and already has a CREDIT card (created earlier), it stays,
    // but NO new cards can be created.
    const lockedByCreditWhileUnemployed = !isEmployed && creditCount > 0;

    const canAddDebit =
        !lockedByCreditWhileUnemployed &&
        totalCount < (limits.total ?? 4) &&
        debitCount < (limits.debit ?? 3);

    const canAddCredit =
        !lockedByCreditWhileUnemployed &&
        isEmployed &&
        totalCount < (CARD_LIMITS[EMPLOYMENT_STATUS.EMPLOYED].total ?? 4) &&
        creditCount < 1;

    const canAddAny = canAddDebit || canAddCredit;

    const goToAddCard = () => {
        if (!canAddAny) return;
        navigate("/cards/add");
    };

    const fmtDate = (value) => {
        if (!value) return "—";
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleString();
    };

    return (
        <Wrapper>

            <HeaderRow>
                <Title>Current Card</Title>

                <AddCardButton
                    onClick={goToAddCard}
                    disabled={!canAddAny}
                    title={!canAddAny ? (lockedByCreditWhileUnemployed ? "You have a credit card. While unemployed you cannot create new cards." : "Card limit reached.") : "Create a new card"}
                >
                    Add Card
                </AddCardButton>
            </HeaderRow>

            {/* Current card carousel */}
            <CardsCarousel cards={list} />

            {/* Recent Transactions */}
            <Title style={{ marginTop: "20px" }}>Recent Transactions</Title>

            <TxList>
                {recent?.length > 0 ? (
                    recent.slice(0, 5).map((tx) => (
                        <TxItem key={tx.id}>
                            <TxLeft>
                                <strong>{tx.description}</strong>
                                <span>{fmtDate(tx.date)}</span>
                            </TxLeft>
                            <TxRight>
                                {tx.signedAmount < 0 ? "-" : tx.signedAmount > 0 ? "+" : ""}
                                {Number(tx.amount || 0).toFixed(2)} {tx.currency || "AZN"}
                            </TxRight>
                        </TxItem>
                    ))
                ) : (
                    <p style={{ opacity: 0.6 }}>No transactions yet.</p>
                )}
            </TxList>

        </Wrapper>
    );
};

export default CardList;
