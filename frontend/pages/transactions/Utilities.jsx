// src/pages/transactions/Utilities.jsx
import React, { useMemo, useState } from "react";
import Typography from "../../components/ui/Typography";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { useCards } from "../../contexts/CardsContext";
import { useTransactions } from "../../contexts/TransactionsContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { bankApi } from "../../api/bankApi";
import {
    Wrapper,
    Grid,
    UtilityCard,
    FormCard,
    Field,
    Label,
} from "./Utilities.styles";

const PROVIDERS = ["Azerqaz", "Azersu", "Azerishiq"];

const providerToServiceType = (provider) => {
    switch (provider) {
        case "Azerqaz":
            return "GAS";
        case "Azersu":
            return "WATER";
        case "Azerishiq":
            return "LIGHT";
        default:
            return null;
    }
};

const Utilities = () => {
    const { paymentCards: cards = [], refresh } = useCards();
    const { refreshRecent } = useTransactions();
    const { pushSuccess, pushError } = useNotifications();

    const [provider, setProvider] = useState(null);
    const [form, setForm] = useState({ code: "", cardId: "", amount: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const serviceType = useMemo(() => providerToServiceType(provider), [provider]);

    const handleInput = (e) => {
        let { name, value } = e.target;

        if (name === "code" || name === "amount") {
            value = value.replace(/\D/g, "");
        }

        setForm({ ...form, [name]: value });
        setError("");
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!serviceType) {
            setError("Choose a provider.");
            return;
        }
        if (!form.cardId) {
            setError("Choose a card.");
            return;
        }
        if (!form.code) {
            setError("Enter code.");
            return;
        }
        if (!form.amount || Number(form.amount) <= 0) {
            setError("Enter amount.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            await bankApi.payUtility({
                senderCardId: form.cardId,
                receiverCode: form.code,
                amount: form.amount,
                serviceType,
            });

            await refresh();
            await refreshRecent();
            pushSuccess("Payment successful.", "Utilities");
            goBack();
        } catch (err) {
            const msg = err?.message || "Payment failed.";
            setError(msg);
            pushError(msg, "Utilities");
        } finally {
            setSubmitting(false);
        }
    };

    const goBack = () => {
        setProvider(null);
        setForm({ code: "", cardId: "", amount: "" });
    };

    return (
        <Wrapper>
            <Typography as="h1" size="xl" weight="bold">
                Utilities
            </Typography>

            {!provider && (
                <Grid>
                    {PROVIDERS.map((p) => (
                        <UtilityCard key={p} onClick={() => setProvider(p)}>
                            {p}
                        </UtilityCard>
                    ))}
                </Grid>
            )}

            {provider && (
                <FormCard>
                    <Typography as="h2" size="lg" weight="semibold">
                        Pay {provider}
                    </Typography>

                    {/* BACK BUTTON */}
                    <Button
                        variant="secondary"
                        style={{ marginBottom: "14px" }}
                        type="button"
                        onClick={goBack}
                    >
                        ← Back
                    </Button>

                    <form onSubmit={submit}>
                        <Field>
                            <Label>Code</Label>
                            <TextInput
                                name="code"
                                value={form.code}
                                onChange={handleInput}
                                placeholder="123456"
                            />
                        </Field>

                        <Field>
                            <Label>Select card</Label>
                            <select
                                name="cardId"
                                value={form.cardId}
                                onChange={handleInput}
                                style={{
                                    padding: "10px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                }}
                            >
                                <option value="">Choose a card</option>
                                {cards.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.number} — {c.balance} {c.currency}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field>
                            <Label>Amount (AZN)</Label>
                            <TextInput
                                name="amount"
                                value={form.amount}
                                onChange={handleInput}
                            />
                        </Field>

                        <Button fullWidth type="submit" disabled={submitting}>
                            {submitting ? "Paying..." : "Pay"}
                        </Button>

                        {error && (
                            <Typography size="sm" color="danger" style={{ marginTop: 12 }}>
                                {error}
                            </Typography>
                        )}
                    </form>
                </FormCard>
            )}
        </Wrapper>
    );
};

export default Utilities;
