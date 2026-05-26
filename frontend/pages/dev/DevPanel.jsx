// src/pages/dev/DevPanel.jsx
import React, { useState } from "react";
import Typography from "../../components/ui/Typography";
import Button from "../../components/ui/Button";
import TextInput from "../../components/ui/TextInput";
import { bankApi } from "../../api/bankApi";

const DevPanel = () => {
  const [cardId, setCardId] = useState("");
  const [businessDate, setBusinessDate] = useState("");
  const [amount, setAmount] = useState("");
  const [log, setLog] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async (fn) => {
    setLoading(true);
    setLog("");
    try {
      const res = await fn();
      setLog(typeof res === "string" ? res : JSON.stringify(res, null, 2));
    } catch (e) {
      setLog(e?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const idNum = Number(cardId);
  const amtNum = Number(amount);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Typography as="h1" size="xl" weight="bold">
        Dev Panel (Credit Card Jobs)
      </Typography>

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <TextInput placeholder="Credit cardId" value={cardId} onChange={(e) => setCardId(e.target.value.replace(/\D/g, ""))} />
        <TextInput type="date" placeholder="businessDate" value={businessDate} onChange={(e) => setBusinessDate(e.target.value)} />
        <TextInput placeholder="amount" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button disabled={loading} onClick={() => run(() => bankApi.statementsJobFinalize({ date: businessDate || undefined }))}>
          Finalize (statement date)
        </Button>
        <Button disabled={loading} variant="secondary" onClick={() => run(() => bankApi.statementsJobDue({ date: businessDate || undefined }))}>
          Process Due Dates
        </Button>
        <Button disabled={loading} variant="secondary" onClick={() => run(() => bankApi.statementsJobInterest({ date: businessDate || undefined }))}>
          Accrue 1 day interest
        </Button>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Button
          disabled={loading || !idNum || !amtNum || !businessDate}
          onClick={() => run(() => bankApi.creditCardRepayTest({ cardId: idNum, amount: amtNum, businessDate }))}
        >
          Test repay
        </Button>
        <Button
          disabled={loading || !idNum}
          variant="secondary"
          onClick={() => run(() => bankApi.getStatementsByCard({ cardId: idNum }))}
        >
          Load statements
        </Button>
      </div>

      <div style={{ border: "1px solid rgba(148,163,184,.25)", borderRadius: 12, padding: 12, whiteSpace: "pre-wrap" }}>
        {log || "Run a job to see output"}
      </div>
    </div>
  );
};

export default DevPanel;
