// src/pages/cashback/Cashback.jsx
import React, { useEffect, useMemo, useState } from "react";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { useUser } from "../../contexts/UserContext";
import { useCards } from "../../contexts/CardsContext";
import { useTransactions } from "../../contexts/TransactionsContext";
import { useNotifications } from "../../contexts/NotificationContext";
import { bankApi } from "../../api/bankApi";

import { Wrapper, BalanceCard, Grid, Card, Field, Label, Hint, Error } from "./Cashback.styles";

const onlyDigits = (v) => String(v || "").replace(/\D/g, "");

const PROVIDERS = [
  { label: "Azerqaz", serviceType: "GAS" },
  { label: "Azersu", serviceType: "WATER" },
  { label: "Azerishiq", serviceType: "LIGHT" },
];

const fmt = (n) => {
  const num = Number(n || 0);
  return Number.isFinite(num) ? num.toFixed(2) : "0.00";
};

const Cashback = () => {
  const { user } = useUser();
  const { paymentCards: cards = [], refresh: refreshCards } = useCards();
  const { refreshRecent } = useTransactions();
  const { pushSuccess, pushError } = useNotifications();

  const userId = user?.id;

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [transfer, setTransfer] = useState({ targetCardId: "", amount: "" });
  const [pay, setPay] = useState({ provider: "GAS", receiverCode: "", amount: "" });

  const cardOptions = useMemo(() => {
    return (cards || []).map((c) => ({ id: c.id, label: `${c.number} — ${fmt(c.balance)} ${c.currency || "AZN"}` }));
  }, [cards]);

  const load = async () => {
    if (!userId) return;
    setLoading(true);
    setError("");
    try {
      const res = await bankApi.cashbackGet({ userId });
      setBalance(Number(res?.balance || 0));
    } catch (e) {
      setError(e?.message || "Failed to load cashback");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const doTransfer = async (e) => {
    e.preventDefault();
    setError("");

    const amount = Number(transfer.amount || 0);
    if (!transfer.targetCardId) return setError("Choose target card");
    if (!amount || amount <= 0) return setError("Enter amount");

    try {
      setLoading(true);
      await bankApi.cashbackTransfer({ userId, targetCardId: Number(transfer.targetCardId), amount });
      setTransfer({ targetCardId: "", amount: "" });
      await refreshCards();
      await refreshRecent();
      await load();
      pushSuccess("Cashback transferred.", "Cashback");
    } catch (e2) {
      const msg = e2?.message || "Transfer failed";
      setError(msg);
      pushError(msg, "Cashback");
    } finally {
      setLoading(false);
    }
  };

  const doPay = async (e) => {
    e.preventDefault();
    setError("");

    const amount = Number(pay.amount || 0);
    if (!pay.receiverCode) return setError("Enter receiver code");
    if (!amount || amount <= 0) return setError("Enter amount");

    try {
      setLoading(true);
      await bankApi.cashbackPay({ userId, amount, serviceType: pay.provider, receiverCode: pay.receiverCode });
      setPay((p) => ({ ...p, receiverCode: "", amount: "" }));
      await refreshRecent();
      await load();
      pushSuccess("Utility paid from cashback.", "Cashback");
    } catch (e2) {
      const msg = e2?.message || "Payment failed";
      setError(msg);
      pushError(msg, "Cashback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Typography as="h1" size="xl" weight="bold">
        Cashback
      </Typography>

      <BalanceCard>
        <div>
          <Typography size="sm" color="muted">Current cashback balance</Typography>
          <Typography size="xl" weight="900">{fmt(balance)} AZN</Typography>
        </div>
        <Button variant="secondary" onClick={load} disabled={loading}>Refresh</Button>
      </BalanceCard>

      {error ? <Error>{error}</Error> : null}

      <Grid>
        <Card>
          <Typography size="lg" weight="800">Transfer to your card</Typography>
          <form onSubmit={doTransfer} style={{ display: "grid", gap: 12, marginTop: 10 }}>
            <Field>
              <Label>Target card</Label>
              <select
                value={transfer.targetCardId}
                onChange={(e) => setTransfer((p) => ({ ...p, targetCardId: e.target.value }))}
                style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(148,163,184,.35)", background: "transparent" }}
              >
                <option value="">Choose card</option>
                {cardOptions.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </select>
            </Field>

            <Field>
              <Label>Amount</Label>
              <TextInput
                value={transfer.amount}
                onChange={(e) => setTransfer((p) => ({ ...p, amount: e.target.value.replace(/[^0-9.]/g, "") }))}
                placeholder="10.00"
              />
              <Hint>Money will be added to the selected card balance.</Hint>
            </Field>

            <Button type="submit" disabled={loading}>Transfer</Button>
          </form>
        </Card>

        <Card>
          <Typography size="lg" weight="800">Pay utilities from cashback</Typography>
          <form onSubmit={doPay} style={{ display: "grid", gap: 12, marginTop: 10 }}>
            <Field>
              <Label>Provider</Label>
              <select
                value={pay.provider}
                onChange={(e) => setPay((p) => ({ ...p, provider: e.target.value }))}
                style={{ padding: 10, borderRadius: 10, border: "1px solid rgba(148,163,184,.35)", background: "transparent" }}
              >
                {PROVIDERS.map((p) => (
                  <option key={p.serviceType} value={p.serviceType}>{p.label}</option>
                ))}
              </select>
            </Field>

            <Field>
              <Label>Receiver code</Label>
              <TextInput
                value={pay.receiverCode}
                onChange={(e) => setPay((p) => ({ ...p, receiverCode: onlyDigits(e.target.value) }))}
                placeholder="123456"
              />
            </Field>

            <Field>
              <Label>Amount</Label>
              <TextInput
                value={pay.amount}
                onChange={(e) => setPay((p) => ({ ...p, amount: e.target.value.replace(/[^0-9.]/g, "") }))}
                placeholder="10.00"
              />
            </Field>

            <Button type="submit" disabled={loading}>Pay</Button>
          </form>
        </Card>
      </Grid>
    </Wrapper>
  );
};

export default Cashback;
