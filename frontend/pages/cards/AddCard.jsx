// src/pages/cards/AddCard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// RefreshCw removed: PPN is now VISA/MASTERCARD selection (string)

import { useCards } from "../../contexts/CardsContext";
import { useUser } from "../../contexts/UserContext";
import { CARD_LIMITS, EMPLOYMENT_STATUS } from "../../utils/constants";
import PasswordInput from "../../components/ui/PasswordInput";

import {
  Wrapper,
  Card,
  Form,
  Field,
  Label,
  Input,
  ErrorBox,
  SubmitBtn,
  BackButton,
} from "./AddCard.styles";

const onlyDigits = (v) => String(v || "").replace(/\D/g, "");

const BRANDS = ["VISA", "MASTERCARD"]; // backend expects string and returns same

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const calcMaxLoan65 = (salary, step) => {
  const s = Number(salary || 0);
  if (!Number.isFinite(s) || s <= 0) return 0;
  const rawMax = s * 0.65;
  if (!Number.isFinite(rawMax) || rawMax <= 0) return 0;
  // Always round DOWN to avoid ever exceeding 65%.
  const stepped = Math.floor(rawMax / step) * step;
  return Math.max(0, stepped);
};

const normalizeLoanInput = (value, maxLoan, step) => {
  const digits = String(value || "").replace(/\D/g, "");
  const num = Number(digits || 0);
  const clipped = clamp(num, 0, maxLoan);
  // Round DOWN to step to guarantee <= maxLoan.
  return String(Math.floor(clipped / step) * step);
};

const AddCard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addCard, paymentCards: cards = [], loading } = useCards();
  const { user, employmentStatus, isEmployed } = useUser();

  const isOnboarding = useMemo(() => {
    try {
      return new URLSearchParams(location.search).get("onboarding") === "1";
    } catch {
      return false;
    }
  }, [location.search]);

  const cardTypeOf = (c) => String(c?.type ?? c?.cardType ?? c?.card_type ?? "").toLowerCase();
  const totalCount = (cards || []).length;
  const debitCount = (cards || []).filter((c) => cardTypeOf(c) === "debit").length;
  const creditCount = (cards || []).filter((c) => cardTypeOf(c) === "credit").length;

  const limits = CARD_LIMITS[employmentStatus] || CARD_LIMITS[EMPLOYMENT_STATUS.UNEMPLOYED];
  const MAX_TOTAL = limits.total ?? 4;
  const MAX_DEBIT = limits.debit ?? 3;
  const MAX_CREDIT = limits.credit ?? 0;

  // Rule: if user is UNEMPLOYED and already has a CREDIT card (created earlier), it stays,
  // but NO new cards can be created.
  const lockedByCreditWhileUnemployed = !isEmployed && creditCount > 0;

  const canAddAny = !lockedByCreditWhileUnemployed && totalCount < MAX_TOTAL;
  const canAddDebit = canAddAny && debitCount < MAX_DEBIT;
  // Credit cards are available only for employed users.
  const canAddCredit = canAddAny && isEmployed && creditCount < 1;

  const hasCreditCard = creditCount >= 1;

  const salary = useMemo(() => Number(user?.salary || 0), [user?.salary]);

  // Slider step: smaller steps for small salaries to avoid maxLoan becoming 0 too often.
  const sliderStep = useMemo(() => {
    const rawMax = salary > 0 ? salary * 0.65 : 0;
    if (rawMax < 100) return 1;
    if (rawMax < 500) return 10;
    if (rawMax < 2000) return 50;
    return 100;
  }, [salary]);

  const maxLoan = useMemo(() => calcMaxLoan65(salary, sliderStep), [salary, sliderStep]);

  const recommendedLimit = useMemo(() => {
    if (maxLoan <= 0) return 0;
    // Default suggestion: 50% of max (still <= 65% salary)
    const raw = maxLoan * 0.5;
    const roundedDown = Math.floor(raw / sliderStep) * sliderStep;
    return clamp(roundedDown, sliderStep, maxLoan);
  }, [maxLoan, sliderStep]);

  const [form, setForm] = useState(() => ({
    type: "debit",
    currency: "AZN",
    ppn: "VISA",
    loanAmount: "",
    pin: "",
  }));

  const [error, setError] = useState("");

  const setField = (name, value) => {
    setError("");
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "loanAmount") return setField(name, normalizeLoanInput(value, maxLoan, sliderStep));
    setField(name, value);
  };

  // Keep loanAmount always within [0..maxLoan] when salary/maxLoan changes.
  useEffect(() => {
    setForm((prev) => {
      if (String(prev.type).toLowerCase() !== "credit") return prev;
      if (maxLoan <= 0) {
        return { ...prev, loanAmount: "" };
      }

      const current = Number(prev.loanAmount || 0);
      if (!current || current <= 0) {
        return { ...prev, loanAmount: String(recommendedLimit) };
      }
      if (current > maxLoan) {
        return { ...prev, loanAmount: String(maxLoan) };
      }
      // ensure step rounding
      const normalized = Number(normalizeLoanInput(current, maxLoan, sliderStep));
      return { ...prev, loanAmount: String(normalized) };
    });
  }, [maxLoan, recommendedLimit, sliderStep]);

  const validate = () => {
    if (!canAddAny) {
      if (lockedByCreditWhileUnemployed) {
        return "You have a credit card. While unemployed you cannot create new cards.";
      }
      return `Card limit reached. Max ${MAX_TOTAL} cards per user.`;
    }
    if (String(form.type).toLowerCase() === "debit" && !canAddDebit) return `You can have up to ${MAX_DEBIT} debit cards.`;
    if (String(form.type).toLowerCase() === "credit" && !canAddCredit) {
      return isEmployed ? "You already have a credit card." : "Credit cards are available only for employed users.";
    }

    if (!form.currency) return "Choose currency";
    if (!BRANDS.includes(String(form.ppn))) return "Choose card brand (VISA or MASTERCARD)";

    const pin = onlyDigits(form.pin);
    if (pin.length !== 4) return "PIN must be exactly 4 digits";

    if (String(form.type).toLowerCase() === "credit") {
      if (hasCreditCard) return "You already have a credit card";
      if (!Number.isFinite(salary) || salary <= 0) return "Salary not found. Update your profile first.";
      if (maxLoan <= 0) return "Your salary is too low to create a credit card.";
      const limit = Number(form.loanAmount || 0);
      if (limit <= 0) return "Enter credit limit";
      if (limit > maxLoan) return `Credit limit cannot exceed ${maxLoan} AZN (65% of your salary).`;
    }

    return "";
  };

  const submit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    try {
      await addCard({
        type: form.type,
        currency: form.currency,
        ppn: String(form.ppn),
        loanAmount: String(form.type).toLowerCase() === "credit" ? Number(form.loanAmount) : undefined,
        pin: onlyDigits(form.pin),
      });
      navigate("/cards");
    } catch (e2) {
      setError(e2?.message || "Failed to create card");
    }
  };

  const fillRecommended = () => {
    if (maxLoan > 0) setField("loanAmount", String(recommendedLimit));
  };

  const fillMax = () => {
    if (maxLoan > 0) setField("loanAmount", String(maxLoan));
  };

  // PPN is the card brand in this backend (VISA/MASTERCARD).

  return (
    <Wrapper>
      <Card>
        <BackButton onClick={() => navigate("/cards")}>← Back to Cards</BackButton>

        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Add a new card</h2>

        {lockedByCreditWhileUnemployed && (
          <div
            style={{
              border: "1px solid rgba(239,68,68,0.35)",
              background: "rgba(239,68,68,0.10)",
              padding: 14,
              borderRadius: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Card creation blocked</div>
            <div style={{ fontSize: 13, opacity: 0.88, lineHeight: 1.4 }}>
              You already have a credit card. While unemployed you cannot create new cards.
              Repay your credit debt (if any) and/or switch employment status in Profile.
            </div>
          </div>
        )}

        {isOnboarding && (
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(59,130,246,0.10)",
              padding: 14,
              borderRadius: 14,
              marginBottom: 16,
            }}
          >
            <div style={{ fontWeight: 900, marginBottom: 6 }}>Step 3 of 3 — Create your first card</div>
            <div style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.4 }}>
              {isEmployed ? (
                <>
                  You can create up to <b>{MAX_DEBIT}</b> debit cards and <b>{CARD_LIMITS[EMPLOYMENT_STATUS.EMPLOYED].credit}</b> credit card (max <b>{MAX_TOTAL}</b> total).
                  Start with a debit card for everyday payments — you can add a credit card later (if your salary is set).
                </>
              ) : (
                <>
                  You can create up to <b>{MAX_DEBIT}</b> debit cards (max <b>{MAX_TOTAL}</b> total).
                  Credit cards are available only for employed users.
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => navigate("/cards")}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "8px 12px",
                  borderRadius: 12,
                  cursor: "pointer",
                  color: "inherit",
                  fontWeight: 800,
                }}
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {!canAddAny && (
          <div
            style={{
              border: "1px solid rgba(220,38,38,0.35)",
              background: "rgba(220,38,38,0.10)",
              padding: 14,
              borderRadius: 14,
              marginBottom: 16,
              fontWeight: 900,
            }}
          >
            Card limit reached: max {MAX_TOTAL} cards per user.
          </div>
        )}

        <Form onSubmit={submit}>
          <Field>
            <Label>Card type</Label>
            <select
              name="type"
              value={form.type}
              onChange={(e) => {
                const nextType = e.target.value;
                setField("type", nextType);
                if (String(nextType).toLowerCase() === "credit") {
                  if (maxLoan > 0) setField("loanAmount", String(recommendedLimit));
                  else setField("loanAmount", "");
                }
              }}
              style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ccc" }}
            >
              <option value="debit" disabled={!canAddDebit}>Debit {!canAddDebit ? `(limit ${MAX_DEBIT})` : ""}</option>
              <option value="credit" disabled={!canAddCredit || maxLoan <= 0}>
                Credit
                {!isEmployed
                  ? " (employed only)"
                  : !canAddCredit
                    ? " (limit reached)"
                    : maxLoan <= 0
                      ? " (salary required)"
                      : ""}
              </option>
            </select>
          </Field>

          <Field>
            <Label>Currency</Label>
            <select
              name="currency"
              value={form.currency}
              onChange={onChange}
              style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ccc" }}
            >
              <option value="AZN">AZN</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </Field>

          <Field>
            <Label>Card brand (PPN)</Label>
            <select
              name="ppn"
              value={form.ppn}
              onChange={onChange}
              style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ccc" }}
            >
              {BRANDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </Field>

          <Field>
            <Label>PIN (4 digits)</Label>
            <PasswordInput
              name="pin"
              value={form.pin}
              onChange={(e) => setField("pin", onlyDigits(e.target.value).slice(0, 4))}
              placeholder="••••"
            />
          </Field>

          {String(form.type).toLowerCase() === "credit" && (
            <Field>
              <Label>Credit limit (AZN)</Label>
              <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 8 }}>
                Salary: <b>{Number.isFinite(salary) ? salary : "—"}</b> AZN · Max (65%): <b>{maxLoan}</b> AZN
              </div>

              <input
                type="range"
                min={0}
                max={maxLoan}
                step={sliderStep}
                value={Number(form.loanAmount || 0)}
                onChange={(e) => setField("loanAmount", String(e.target.value))}
                disabled={maxLoan <= 0}
                style={{ width: "100%", marginBottom: 10 }}
                aria-label="Credit limit slider"
              />

              <Input
                name="loanAmount"
                value={form.loanAmount}
                onChange={onChange}
                placeholder={maxLoan > 0 ? String(recommendedLimit) : "Update salary first"}
                disabled={maxLoan <= 0}
              />

              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={fillRecommended}
                  disabled={maxLoan <= 0}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: maxLoan > 0 ? "pointer" : "not-allowed",
                    color: "#3b82f6",
                    fontWeight: 800,
                  }}
                >
                  Use recommended ({recommendedLimit})
                </button>

                <button
                  type="button"
                  onClick={fillMax}
                  disabled={maxLoan <= 0}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: maxLoan > 0 ? "pointer" : "not-allowed",
                    color: "#3b82f6",
                    fontWeight: 800,
                  }}
                >
                  Max ({maxLoan})
                </button>
              </div>

              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
                Limit cannot exceed <b>65%</b> of your salary.
              </div>
            </Field>
          )}

          {error && <ErrorBox>{error}</ErrorBox>}

          <SubmitBtn disabled={loading || !canAddAny || (String(form.type).toLowerCase()==="debit" && !canAddDebit) || (String(form.type).toLowerCase()==="credit" && (!canAddCredit || maxLoan<=0))}>{loading ? "Creating..." : "Create Card"}</SubmitBtn>
        </Form>
      </Card>
    </Wrapper>
  );
};

export default AddCard;
