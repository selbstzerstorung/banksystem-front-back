// src/pages/cards/CardDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../components/ui/Button";
import Typography from "../../components/ui/Typography";
import TextInput from "../../components/ui/TextInput";
import PasswordInput from "../../components/ui/PasswordInput";

import { useCards } from "../../contexts/CardsContext";
import { useTransactions } from "../../contexts/TransactionsContext";
import { bankApi } from "../../api/bankApi";
import { useUser } from "../../contexts/UserContext";

import {
    Wrapper,
    CardLayout,
    CardFlipContainer,
    CardFlipInner,
    CardFront,
    CardFrontTop,
    CardScheme,
    CardTypePill,
    CardNumberBig,
    CardFrontBottom,
    CardHolderText,
    CardHolderTextRight,
    CardLabelSmall,
    CardValueStrong,
    CardBack,
    CvvBox,
    CardBackFooter,
    CardBox,
    Section,
    Row,
    Label,
    Value,
    CreditInfo,
    CreditText,
    ProgressBar,
    ProgressFill,
    Actions,
    TxSection,
    TxList,
    TxItem,
    TxLeft,
    TxRight,
    CardFrontActions,
    EyeButton,
} from "./CardDetails.styles";

const fmtMoney = (n) => {
    const num = Number(n || 0);
    return Number.isFinite(num) ? num.toFixed(2) : "0.00";
};

const formatCardNumber = (num) => {
    const s = String(num || "").replace(/\s/g, "");
    if (s.length < 8) return s;
    return `${s.slice(0, 4)} ${s.slice(4, 8)} ${s.slice(8, 12)} ${s.slice(12, 16)}`.trim();
};

// Default UI masking: hide the first 12 digits and show only last 4.
const maskFirst12Digits = (num) => {
    const s = String(num || "").replace(/\s/g, "");
    const last4 = s.slice(-4);
    if (!last4) return "";
    return `•••• •••• •••• ${last4}`;
};

const EyeIcon = ({ off = false }) => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        {off ? (
            <>
                <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                    d="M10.58 10.58a2 2 0 0 0 2.84 2.84"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M9.88 5.1A10.94 10.94 0 0 1 12 4c6.5 0 10 8 10 8a18.4 18.4 0 0 1-3.22 4.56"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                <path
                    d="M6.11 6.11C3.73 8.09 2 12 2 12s3.5 8 10 8c1.06 0 2.07-.18 3.02-.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </>
        ) : (
            <>
                <path
                    d="M2 12s3.5-8 10-8 10 8 10 8-3.5 8-10 8-10-8-10-8Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
                <path
                    d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />
            </>
        )}
    </svg>
);

const CardDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const cardId = Number(id);

    const { user } = useUser();
    const { cards, cardsMeta, block, unlock, resetPin, refresh } = useCards();
    const { transactions, refreshCardTransactions } = useTransactions();

    const card = useMemo(() => (cards || []).find((c) => Number(c.id) === cardId), [cards, cardId]);
    const meta = cardsMeta?.[cardId] || null;

    const [rotated, setRotated] = useState(false);
    const [showFullNumber, setShowFullNumber] = useState(false);
    const [statements, setStatements] = useState([]);
    const [stmtLoading, setStmtLoading] = useState(false);
    const [pinForm, setPinForm] = useState({ open: false, pin: "", codeword: "", newPin: "", confirm: "" });
    const [pinMsg, setPinMsg] = useState(null);

    const cardholderFullName = useMemo(() => {
        const full = [user?.name, user?.surname].filter(Boolean).join(" ").trim();
        return full || "—";
    }, [user?.name, user?.surname]);

    useEffect(() => {
        if (!Number.isFinite(cardId)) return;
        refreshCardTransactions(cardId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cardId]);

    useEffect(() => {
        const load = async () => {
            if (!Number.isFinite(cardId)) return;
            if (meta?.type !== "credit") {
                setStatements([]);
                return;
            }
            try {
                setStmtLoading(true);
                const list = await bankApi.getStatementsByCard({ cardId });
                setStatements(Array.isArray(list) ? list : []);
            } catch {
                setStatements([]);
            } finally {
                setStmtLoading(false);
            }
        };
        load();
    }, [cardId, meta?.type]);

    const effective = meta || card;
    const type = String(effective?.type || card?.type || "").toLowerCase();
    const currency = effective?.currency || card?.currency || "AZN";

    const brand = useMemo(() => {
        const b = String(effective?.ppn ?? card?.ppn ?? "").trim();
        return b ? b.toUpperCase() : "—";
    }, [effective?.ppn, card?.ppn]);

    const cardNumberText = useMemo(() => {
        const raw = effective?.number || card?.number || "";
        return showFullNumber ? formatCardNumber(raw) : maskFirst12Digits(raw);
    }, [showFullNumber, effective?.number, card?.number]);

    // ✅ Под CardsContext: cvv уже нормализован в effective.cvv (и для debit, и для credit)
    const cvvValue = useMemo(() => {
        const v = effective?.cvv ?? card?.cvv;
        const s = v == null ? "" : String(v);
        return s.trim() ? s : "***";
    }, [effective?.cvv, card?.cvv]);

    // Cashback is not a "card" UI in this app. If someone opens /cards/:id for cashback,
    // route them to the dedicated cashback page.
    useEffect(() => {
        if (type === "cashback") {
            navigate("/cashback", { replace: true });
        }
    }, [type, navigate]);

    const status = String(effective?.status || card?.status || "ACTIVE").toUpperCase();
    const isBlocked = status === "BLOCKED";

    const creditUsage = useMemo(() => {
        if (type !== "credit") return { percent: 0, text: "" };
        const limit = Number(effective?.loanAmount || 0);

        // IMPORTANT (backend contract): for CREDIT cards, backend.balance = AVAILABLE credit.
        const available = Number(effective?.balance ?? card?.balance ?? 0);
        if (!limit) return { percent: 0, text: "" };

        const debt = Math.max(0, limit - (Number.isFinite(available) ? available : 0));
        const p = Math.min(100, Math.max(0, (debt / limit) * 100));
        return {
            percent: p,
            text: `DEBT ${fmtMoney(debt)} / ${fmtMoney(limit)} ${currency} · AVAILABLE ${fmtMoney(available)} ${currency}`,
        };
    }, [type, effective?.loanAmount, effective?.balance, card?.balance, currency]);

    const doBlockToggle = async () => {
        try {
            if (isBlocked) await unlock(cardId);
            else await block(cardId);
        } finally {
            await refresh();
        }
    };

    const submitResetPin = async (e) => {
        e.preventDefault();
        setPinMsg(null);

        const pin = String(pinForm.pin || "").replace(/\D/g, "");
        const newPin = String(pinForm.newPin || "").replace(/\D/g, "");

        if (pin.length !== 4) return setPinMsg({ type: "error", text: "Current PIN must be 4 digits" });
        if (!pinForm.codeword || pinForm.codeword.length < 2)
            return setPinMsg({ type: "error", text: "Enter your codeword" });
        if (newPin.length !== 4) return setPinMsg({ type: "error", text: "New PIN must be 4 digits" });
        if (newPin !== String(pinForm.confirm || "").replace(/\D/g, ""))
            return setPinMsg({ type: "error", text: "New PINs do not match" });

        try {
            await resetPin({ cardId, pin, codeword: pinForm.codeword, newPin });
            setPinMsg({ type: "success", text: "PIN updated" });
            setPinForm({ open: false, pin: "", codeword: "", newPin: "", confirm: "" });
        } catch (err) {
            setPinMsg({ type: "error", text: err?.message || "PIN reset failed" });
        }
    };

    if (!card) {
        return (
            <Wrapper>
                <Typography size="lg" weight="700">
                    Card not found
                </Typography>
                <Button variant="secondary" onClick={() => navigate("/cards")}>← Back</Button>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Button variant="secondary" onClick={() => navigate("/cards")} style={{ alignSelf: "flex-start" }}>
                ← Back
            </Button>

            <CardLayout>
                <CardFlipContainer onClick={() => setRotated((r) => !r)}>
                    <CardFlipInner rotated={rotated}>
                        <CardFront>
                            <CardFrontTop>
                                <CardScheme>{brand}</CardScheme>

                                <CardFrontActions>
                                    {/* Eye toggle: do NOT flip the card when toggling visibility */}
                                    <EyeButton
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowFullNumber((s) => !s);
                                        }}
                                        aria-label={showFullNumber ? "Hide card number" : "Show card number"}
                                        title={showFullNumber ? "Hide card number" : "Show card number"}
                                    >
                                        <EyeIcon off={showFullNumber} />
                                    </EyeButton>

                                    <CardTypePill>{type.toUpperCase()}</CardTypePill>
                                </CardFrontActions>
                            </CardFrontTop>

                            <CardNumberBig>{cardNumberText}</CardNumberBig>

                            <CardFrontBottom>
                                <CardHolderText>
                                    <CardLabelSmall>Cardholder</CardLabelSmall>
                                    <CardValueStrong>{cardholderFullName}</CardValueStrong>
                                </CardHolderText>

                                <CardHolderTextRight>
                                    <CardLabelSmall>Balance</CardLabelSmall>
                                    <CardValueStrong>
                                        {fmtMoney(effective?.balance ?? card.balance)} {currency}
                                    </CardValueStrong>
                                </CardHolderTextRight>
                            </CardFrontBottom>
                        </CardFront>

                        <CardBack>
                            <div />
                            <CvvBox>{cvvValue}</CvvBox>
                            <CardBackFooter>CVV</CardBackFooter>
                        </CardBack>
                    </CardFlipInner>
                </CardFlipContainer>

                <CardBox>
                    <Typography size="lg" weight="800">
                        Details
                    </Typography>

                    <Section>
                        <Row>
                            <Label>Status</Label>
                            <Value>{status}</Value>
                        </Row>
                        <Row>
                            <Label>Currency</Label>
                            <Value>{currency}</Value>
                        </Row>
                        <Row>
                            <Label>Card ID</Label>
                            <Value>{cardId}</Value>
                        </Row>
                    </Section>

                    {type === "credit" && (
                        <CreditInfo>
                            <CreditText>
                                <b>Credit usage:</b> {creditUsage.text}
                            </CreditText>
                            <ProgressBar>
                                <ProgressFill percent={creditUsage.percent} />
                            </ProgressBar>
                            <CreditText>
                                Limit: <b>{fmtMoney(effective?.loanAmount ?? 0)}</b> {currency}
                            </CreditText>
                            {effective?.interestRate != null ? (
                                <CreditText>
                                    Interest rate: <b>{String(effective.interestRate)}%</b>
                                </CreditText>
                            ) : null}
                        </CreditInfo>
                    )}

                    <Actions>
                        <Button variant={isBlocked ? "primary" : "secondary"} onClick={doBlockToggle}>
                            {isBlocked ? "Unlock card" : "Block card"}
                        </Button>

                        <Button variant="secondary" onClick={() => setPinForm((p) => ({ ...p, open: !p.open }))}>
                            {pinForm.open ? "Close PIN reset" : "Reset PIN"}
                        </Button>

                        {pinForm.open && (
                            <div style={{ marginTop: 6, padding: 12, borderRadius: 12, border: "1px solid rgba(148,163,184,.35)" }}>
                                <Typography size="sm" weight="800" style={{ marginBottom: 8 }}>
                                    Reset PIN (requires current PIN + codeword)
                                </Typography>
                                <form onSubmit={submitResetPin} style={{ display: "grid", gap: 10 }}>
                                    <PasswordInput
                                        placeholder="Current PIN"
                                        value={pinForm.pin}
                                        onChange={(e) =>
                                            setPinForm((p) => ({
                                                ...p,
                                                pin: String(e.target.value).replace(/\D/g, "").slice(0, 4),
                                            }))
                                        }
                                    />
                                    <TextInput
                                        placeholder="Codeword"
                                        value={pinForm.codeword}
                                        onChange={(e) => setPinForm((p) => ({ ...p, codeword: e.target.value }))}
                                    />
                                    <PasswordInput
                                        placeholder="New PIN"
                                        value={pinForm.newPin}
                                        onChange={(e) =>
                                            setPinForm((p) => ({
                                                ...p,
                                                newPin: String(e.target.value).replace(/\D/g, "").slice(0, 4),
                                            }))
                                        }
                                    />
                                    <PasswordInput
                                        placeholder="Confirm new PIN"
                                        value={pinForm.confirm}
                                        onChange={(e) =>
                                            setPinForm((p) => ({
                                                ...p,
                                                confirm: String(e.target.value).replace(/\D/g, "").slice(0, 4),
                                            }))
                                        }
                                    />

                                    {pinMsg ? (
                                        <div style={{ fontSize: 13, fontWeight: 700, color: pinMsg.type === "error" ? "#dc2626" : "#16a34a" }}>
                                            {pinMsg.text}
                                        </div>
                                    ) : null}

                                    <Button type="submit">Update PIN</Button>
                                </form>
                            </div>
                        )}
                    </Actions>

                    {type === "credit" && (
                        <div style={{ marginTop: 18 }}>
                            <Typography size="md" weight="800" style={{ marginBottom: 10 }}>
                                Statements
                            </Typography>
                            {stmtLoading ? (
                                <Typography size="sm" color="muted">Loading statements...</Typography>
                            ) : statements.length ? (
                                <div style={{ display: "grid", gap: 10 }}>
                                    {statements
                                        .slice()
                                        .sort((a, b) => String(b.statementDate || "").localeCompare(String(a.statementDate || "")))
                                        .slice(0, 5)
                                        .map((s) => (
                                            <div
                                                key={s.statementId}
                                                style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(148,163,184,.25)" }}
                                            >
                                                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                                                    <div style={{ fontWeight: 900 }}>
                                                        #{s.statementId} — {String(s.status || "")}
                                                    </div>
                                                    <div style={{ fontWeight: 800 }}>
                                                        Total due: {fmtMoney(s.totalPaymentDue)} {currency}
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: 13, opacity: 0.85, marginTop: 6 }}>
                                                    Statement date: {String(s.statementDate || "—")} | Due: {String(s.dueDate || "—")}
                                                </div>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10, fontSize: 13 }}>
                                                    <div>Opening balance: <b>{fmtMoney(s.openingBalance)}</b></div>
                                                    <div>Closing balance: <b>{fmtMoney(s.closingBalance)}</b></div>
                                                    <div>Interest: <b>{fmtMoney(s.interestCharged)}</b></div>
                                                    <div>Fees: <b>{fmtMoney(s.feesCharged)}</b></div>
                                                    <div>Min payment: <b>{fmtMoney(s.minPaymentDue)}</b></div>
                                                    <div>Total due: <b>{fmtMoney(s.totalPaymentDue)}</b></div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <Typography size="sm" color="muted">No statements yet.</Typography>
                            )}
                        </div>
                    )}
                </CardBox>
            </CardLayout>

            <TxSection>
                <Typography size="lg" weight="800">
                    Recent transactions (this card)
                </Typography>

                {!transactions?.length ? (
                    <Typography size="sm" color="muted" style={{ marginTop: 10 }}>
                        No transactions found.
                    </Typography>
                ) : (
                    <TxList>
                        {transactions.slice(0, 10).map((tx) => (
                            <TxItem key={tx.id}>
                                <TxLeft>
                                    <div style={{ fontWeight: 800 }}>{tx.type}</div>
                                    <div style={{ fontSize: 12, opacity: 0.75 }}>{String(tx.date || "")}</div>
                                </TxLeft>
                                <TxRight>
                                    {tx.signedAmount < 0 ? "-" : tx.signedAmount > 0 ? "+" : ""}
                                    {fmtMoney(tx.amount)} {tx.currency}
                                </TxRight>
                            </TxItem>
                        ))}
                    </TxList>
                )}
            </TxSection>
        </Wrapper>
    );
};

export default CardDetails;
