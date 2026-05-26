// src/pages/transactions/Transfer.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "../../components/ui/Typography";
import TextInput from "../../components/ui/TextInput";
import Button from "../../components/ui/Button";
import { useCards } from "../../contexts/CardsContext";
import { useTransactions } from "../../contexts/TransactionsContext";
import { bankApi } from "../../api/bankApi";

import {
  Wrapper,
  FormCard,
  Form,
  Field,
  Label,
  Select,
  Helper,
  Message,
} from "./Transfer.styles";

const onlyDigits = (v) => String(v || "").replace(/\D/g, "");

const Transfer = () => {
  const navigate = useNavigate();
  const { paymentCards: cards = [], refresh } = useCards();
  const { refreshRecent } = useTransactions();

  const senderOptions = useMemo(() => {
    // Backend TransferRequest uses senderAccountNumber/receiverAccountNumber (card NUMBER).
    return (cards || []).map((c) => ({
      id: c.number,
      label: `${c.number || "Card"} — ${c.balance ?? 0} ${c.currency || ""}`.trim(),
    }));
  }, [cards]);

  const [form, setForm] = useState({
    senderAccountNumber: "",
    receiverAccountNumber: "",
    amount: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "receiverAccountNumber") {
      return setField(name, onlyDigits(value));
    }

    if (name === "amount") {
      // allow decimals but keep it simple: digits + dot
      const cleaned = String(value).replace(/[^0-9.]/g, "");
      return setField(name, cleaned);
    }

    setField(name, value);
  };

  const validate = () => {
    if (!form.senderAccountNumber) return "Choose sender card";
    if (!form.receiverAccountNumber) return "Enter receiver card number";
    if (!form.amount || Number(form.amount) <= 0) return "Enter a valid amount";
    if (Number(form.senderAccountNumber) === Number(form.receiverAccountNumber))
      return "Sender and receiver cannot be the same";
    return "";
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const error = validate();
    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    try {
      setLoading(true);

      const res = await bankApi.transfer({
        senderAccountNumber: form.senderAccountNumber,
        receiverAccountNumber: form.receiverAccountNumber,
        amount: form.amount,
        description: form.description,
      });

      // backend typically returns {success, message, transactionId}
      if (res?.success === false) {
        setMessage({ type: "error", text: res?.message || "Transfer failed" });
        return;
      }

      await refresh();
      await refreshRecent();

      setMessage({
        type: "success",
        text: res?.message || "Transfer completed successfully",
      });

      setForm((prev) => ({
        ...prev,
        senderAccountNumber: prev.senderAccountNumber,
        receiverAccountNumber: "",
        amount: "",
        description: "",
      }));
    } catch (err) {
      setMessage({
        type: "error",
        text: err?.message || "Transfer failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Typography as="h1" size="xl" weight="bold">
        Transfer
      </Typography>

      <FormCard>
        <Typography as="h2" size="lg" weight="semibold">
          Send money to another card
        </Typography>

        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate("/dashboard")}
          style={{ alignSelf: "flex-start" }}
        >
          ← Back
        </Button>

        {message && (
          <Message $variant={message.type === "error" ? "error" : "success"}>
            {message.text}
          </Message>
        )}

        <Form onSubmit={submit}>
          <Field>
            <Label>Sender card</Label>
            <Select
              name="senderAccountNumber"
              value={form.senderAccountNumber}
              onChange={handleInput}
            >
              <option value="">Choose a card</option>
              {senderOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </Select>
            <Helper>
              Backend expects the card <b>number</b> as senderAccountNumber.
            </Helper>
          </Field>

          <Field>
            <Label>Receiver card number</Label>
            <TextInput
              name="receiverAccountNumber"
              value={form.receiverAccountNumber}
              onChange={handleInput}
              placeholder="e.g. 7630706331320469"
            />
          </Field>

          <Field>
            <Label>Amount</Label>
            <TextInput
              name="amount"
              value={form.amount}
              onChange={handleInput}
              placeholder="10.00"
            />
          </Field>

          <Field>
            <Label>Description (optional)</Label>
            <TextInput
              name="description"
              value={form.description}
              onChange={handleInput}
              placeholder="For rent / Gift / etc."
            />
          </Field>

          <Button fullWidth type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send"}
          </Button>
        </Form>
      </FormCard>
    </Wrapper>
  );
};

export default Transfer;
