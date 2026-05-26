// src/pages/public/Previews.jsx
import React from "react";
import FeaturePreview from "./FeaturePreview";

export const CardsPreview = () => (
    <FeaturePreview
        eyebrow="Public preview"
        title="Cards"
        subtitle="Explore the card experience. To create and manage cards, please log in."
        highlights={[
            {
                title: "Debit card",
                text: "Everyday spending with a clear balance and instant history.",
                bullets: ["Fast creation", "Transactions history", "Transfers"],
            },
            {
                title: "Credit card",
                text: "Limit + current debt with statement cycle logic (demo-ready).",
                bullets: ["Credit limit", "Statements & due dates", "Minimum payment flow"],
            },
            {
                title: "Safe UX",
                text: "Designed like modern banks: clean cards UI and predictable navigation.",
                bullets: ["Clear details", "Consistent layout", "Theme support"],
            },
        ]}
    />
);

export const UtilitiesPreview = () => (
    <FeaturePreview
        eyebrow="Public preview"
        title="Utilities"
        subtitle="Utilities help you navigate your activity: filters, history, and summaries."
        highlights={[
            {
                title: "Transaction filters",
                text: "Filter by date, type, amount and quickly find operations.",
                bullets: ["Search", "Date range", "Type filters"],
            },
            {
                title: "History overview",
                text: "See recent activity and understand where money goes.",
                bullets: ["Recent list", "Operation types", "Clear formatting"],
            },
            {
                title: "Ready for analytics",
                text: "Structure is prepared for charts and monthly summaries (future).",
                bullets: ["Monthly totals", "Categories", "Export-ready"],
            },
        ]}
    />
);

export const TransferPreview = () => (
    <FeaturePreview
        eyebrow="Public preview"
        title="Transfer"
        subtitle="Transfers move money between cards/accounts with validation and confirmations."
        highlights={[
            {
                title: "Quick transfers",
                text: "Send money between your cards with a clean, bank-like form.",
                bullets: ["Sender/receiver", "Amount validation", "Instant submit"],
            },
            {
                title: "Safer checks",
                text: "Backend validates balance and prevents invalid operations.",
                bullets: ["Server-side checks", "Error handling", "Clear statuses"],
            },
            {
                title: "Transaction records",
                text: "Every transfer becomes a history record so you can track it later.",
                bullets: ["History entries", "Fees (optional)", "Outgoing/Incoming"],
            },
        ]}
    />
);
