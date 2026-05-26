// src/pages/dashboard/Dashboard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { format, isValid, parseISO } from "date-fns";
import { useTheme } from "styled-components";
import {
    ArrowUpRight,
    Plus,
    ReceiptText,
    Send,
    ChevronRight,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import { bankApi } from "../../api/bankApi";

import Typography from "../../components/ui/Typography";
import { useUser } from "../../contexts/UserContext";
import { useCards } from "../../contexts/CardsContext";
import { useTransactions } from "../../contexts/TransactionsContext";

import {
    Wrapper,
    PageTitleRow,
    LayoutGrid,
    Left,
    Right,
    Card,
    HeroCard,
    HeroTop,
    HeroCardName,
    HeroBalance,
    HeroMeta,
    HeroActions,
    ActionBtn,
    ActionIcon,
    AddCardBtn,
    SectionTitleRow,
    Tabs,
    Tab,
    OpsGrid,
    ChipRow,
    Chip,
    DonutWrap,
    DonutCenter,
    TxList,
    TxRow,
    TxLeft,
    TxIcon,
    TxName,
    TxDate,
    TxAmount,
    SideStack,
    SideStat,
    SideStatValue,
    SideStatLabel,
    SideHint,
    GhostBtn,
} from "./Dashboard.styles";

const safeDate = (iso) => {
    if (!iso) return null;
    const d = typeof iso === "string" ? parseISO(iso) : new Date(iso);
    return isValid(d) ? d : null;
};

const getTxCategory = (tx) => {
    const raw = `${tx?.description || tx?.name || ""} ${tx?.type || ""}`.toLowerCase();

    if (raw.includes("salary") || raw.includes("payroll")) return "Salary";
    if (raw.includes("transfer") || raw.includes("send")) return "Transfers";
    if (raw.includes("gas") || raw.includes("azerqaz")) return "Gas";
    if (raw.includes("water") || raw.includes("azersu")) return "Water";
    if (raw.includes("light") || raw.includes("electric") || raw.includes("azerishiq"))
        return "Electricity";
    if (raw.includes("shop") || raw.includes("market") || raw.includes("store"))
        return "Shopping";

    return "Other";
};

const formatMoney = (amount, currency = "AZN") => {
    const n = Number(amount) || 0;
    try {
        return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
        }).format(n);
    } catch {
        return `${n.toFixed(2)} ${currency}`;
    }
};

const Dashboard = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { user } = useUser() || {};
    const { paymentCards = [], totalBalance = 0, currentCardId } = useCards() || {};
    const {
        transactions = [],
        recent = [],
    } = useTransactions() || {};

    const [tab, setTab] = useState("expense");

    const activeCard = useMemo(() => {
        const list = Array.isArray(paymentCards) ? paymentCards : [];
        if (!list.length) return null;
        const selected = list.find((c) => Number(c?.id) === Number(currentCardId));
        return selected || list[0];
    }, [paymentCards, currentCardId]);

    const heroCurrency = activeCard?.currency || "AZN";

    const monthLabel = useMemo(() => {
        try {
            return format(new Date(), "MMMM");
        } catch {
            return "this month";
        }
    }, []);

    const txData = useMemo(() => {
        const r = Array.isArray(recent) ? recent : [];
        const t = Array.isArray(transactions) ? transactions : [];
        return r.length ? r : t;
    }, [recent, transactions]);

    const totals = useMemo(() => {
        let income = 0;
        let expense = 0;
        for (const tx of txData) {
            const signed = Number(tx?.signedAmount ?? 0);
            if (signed > 0) income += signed;
            if (signed < 0) expense += Math.abs(signed);
        }
        return { income, expense };
    }, [txData]);

    const opsData = useMemo(() => {
        const list = Array.isArray(txData) ? txData : [];

        const now = Date.now();
        const last30d = list.filter((tx) => {
            const d = safeDate(tx?.date || tx?.createdAt);
            if (!d) return true;
            const diff = now - d.getTime();
            return diff <= 30 * 24 * 60 * 60 * 1000;
        });

        const filtered = last30d.filter((tx) => {
            const signed = Number(tx?.signedAmount ?? 0);
            return tab === "income" ? signed > 0 : signed < 0;
        });

        const map = new Map();
        for (const tx of filtered) {
            const amt = Math.abs(Number(tx?.signedAmount ?? 0)) || Math.abs(Number(tx?.amount) || 0);
            const cat = getTxCategory(tx);
            map.set(cat, (map.get(cat) || 0) + amt);
        }

        const sorted = [...map.entries()]
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // Keep donut readable
        return {
            list: sorted,
            total: sorted.reduce((s, x) => s + x.value, 0),
        };
    }, [txData, tab]);

    const colors = useMemo(
        () => [
            theme.primary?.[500] || "#3d8bff",
            theme.primary?.[300] || "#7db1ff",
            theme.status?.success || "#16a34a",
            theme.status?.error || "#dc2626",
            theme.text?.muted || "#777777",
            theme.primary?.[100] || "#d9e7ff",
        ],
        [theme]
    );

    const topCategories = opsData.list.slice(0, 6);
    const txPreview = txData.slice(0, 6);

    const creditCard = useMemo(() => {
        const list = Array.isArray(paymentCards) ? paymentCards : [];
        if (!list.length) return null;
        // Prefer current card if it's credit; otherwise pick any credit card
        const current = list.find((c) => Number(c?.id) === Number(activeCard?.id));
        if (String(current?.type || "").toLowerCase() === "credit") return current;
        return list.find((c) => String(c?.type || "").toLowerCase() === "credit") || null;
    }, [paymentCards, activeCard]);

    const [creditLoading, setCreditLoading] = useState(false);
    const [creditError, setCreditError] = useState("");
    const [latestStatement, setLatestStatement] = useState(null);

    useEffect(() => {
        let alive = true;

        const run = async () => {
            if (!creditCard?.id) {
                setLatestStatement(null);
                setCreditError("");
                return;
            }
            setCreditLoading(true);
            setCreditError("");
            try {
                const st = await bankApi.getLatestStatement({ cardId: creditCard.id });
                if (!alive) return;
                setLatestStatement(st || null);
            } catch (e) {
                if (!alive) return;
                setLatestStatement(null);
                setCreditError(e?.message || "Failed to load latest statement");
            } finally {
                if (!alive) return;
                setCreditLoading(false);
            }
        };

        run();
        return () => {
            alive = false;
        };
    }, [creditCard?.id]);

    return (
        <Wrapper
            as={motion.div}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
        >
            <PageTitleRow>
                <div>
                    <Typography as="h1" size="xl" weight="bold">
                        {user?.name ? `Hello, ${user.name} 👋` : "Dashboard"}
                    </Typography>
                    <Typography size="sm" style={{ opacity: 0.7, marginTop: 4 }}>
                        Your finances at a glance — balance, operations, and quick actions.
                    </Typography>
                </div>
            </PageTitleRow>

            <LayoutGrid>
                <Left>
                    <HeroCard>
                        <HeroTop>
                            <HeroCardName>
                                {activeCard
                                    ? `${(activeCard?.type || "card").toUpperCase()} • ${
                                          String(activeCard?.ppn || "VISA").toUpperCase()
                                      }`
                                    : "NO CARDS YET"}
                            </HeroCardName>

                            <AddCardBtn onClick={() => navigate("/cards/add")}> 
                                <Plus size={18} />
                            </AddCardBtn>
                        </HeroTop>

                        <HeroBalance>
                            {formatMoney(
                                activeCard ? Number(activeCard.balance) || 0 : totalBalance,
                                heroCurrency
                            )}
                        </HeroBalance>

                        <HeroMeta>
                            <span>
                                Total cards: <strong>{paymentCards.length}</strong>
                            </span>
                            <span>
                                Income: <strong>{formatMoney(totals.income, heroCurrency)}</strong>
                            </span>
                            <span>
                                Expense: <strong>{formatMoney(totals.expense, heroCurrency)}</strong>
                            </span>
                        </HeroMeta>

                        <HeroActions>
                            <ActionBtn onClick={() => navigate("/utilities")}> 
                                <ActionIcon>
                                    <ReceiptText size={18} />
                                </ActionIcon>
                                Pay
                                <ArrowUpRight size={16} style={{ opacity: 0.75 }} />
                            </ActionBtn>

                            <ActionBtn onClick={() => navigate("/transfer")}> 
                                <ActionIcon>
                                    <Send size={18} />
                                </ActionIcon>
                                Transfer
                                <ArrowUpRight size={16} style={{ opacity: 0.75 }} />
                            </ActionBtn>
                        </HeroActions>
                    </HeroCard>

                    <Card>
                        <SectionTitleRow>
                            <div>
                                <Typography size="lg" weight="700">
                                    Operations in {monthLabel}
                                </Typography>
                                <Typography size="sm" style={{ opacity: 0.7, marginTop: 2 }}>
                                    Spend / income distribution by category (last 30 days)
                                </Typography>
                            </div>

                            <Tabs>
                                <Tab
                                    $active={tab === "expense"}
                                    onClick={() => setTab("expense")}
                                >
                                    Spent
                                </Tab>
                                <Tab
                                    $active={tab === "income"}
                                    onClick={() => setTab("income")}
                                >
                                    Income
                                </Tab>
                            </Tabs>
                        </SectionTitleRow>

                        <OpsGrid>
                            <div>
                                {topCategories.length === 0 ? (
                                    <div style={{ opacity: 0.65 }}>
                                        No operations yet — pay utilities or transfer to see stats.
                                    </div>
                                ) : (
                                    <>
                                        <ChipRow>
                                            {topCategories.map((c) => (
                                                <Chip key={c.name}>
                                                    {c.name}
                                                    <span>{formatMoney(c.value, heroCurrency)}</span>
                                                </Chip>
                                            ))}
                                        </ChipRow>

                                        <SideHint>
                                            Tip: stats are calculated from your recent backend transaction history.
                                        </SideHint>
                                    </>
                                )}
                            </div>

                            <DonutWrap>
                                <ResponsiveContainer width="100%" height={220}>
                                    <PieChart>
                                        <Pie
                                            data={opsData.list.slice(0, 6)}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            isAnimationActive={false}
                                        >
                                            {opsData.list.slice(0, 6).map((entry, index) => (
                                                <Cell
                                                    key={`cell-${entry.name}`}
                                                    fill={colors[index % colors.length]}
                                                />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <DonutCenter>
                                    <div style={{ opacity: 0.7, fontSize: 12 }}>
                                        {tab === "income" ? "Income" : "Spent"}
                                    </div>
                                    <div style={{ fontSize: 18, fontWeight: 800 }}>
                                        {formatMoney(opsData.total, heroCurrency)}
                                    </div>
                                </DonutCenter>
                            </DonutWrap>
                        </OpsGrid>
                    </Card>

                    <Card>
                        <SectionTitleRow>
                            <Typography size="lg" weight="700">
                                Recent transactions
                            </Typography>
                            <GhostBtn onClick={() => navigate("/transactions")}>
                                View all <ChevronRight size={16} />
                            </GhostBtn>
                        </SectionTitleRow>

                        {txPreview.length === 0 ? (
                            <div style={{ opacity: 0.65 }}>No transactions yet</div>
                        ) : (
                            <TxList>
                                {txPreview.map((tx) => {
                                    const signed = Number(tx?.signedAmount ?? 0);
                                    const d = safeDate(tx?.date);
                                    return (
                                        <TxRow key={tx?.id || `${tx?.name}-${tx?.date}`}
                                            whileHover={{ y: -2 }}
                                        >
                                            <TxLeft>
                                                <TxIcon>
                                                    {signed >= 0 ? (
                                                        <ArrowUpRight size={16} />
                                                    ) : (
                                                        <ReceiptText size={16} />
                                                    )}
                                                </TxIcon>
                                                <div>
                                                    <TxName>{tx?.description || tx?.name || "Transaction"}</TxName>
                                                    <TxDate>
                                                        {d ? format(d, "d MMM, HH:mm") : ""}
                                                    </TxDate>
                                                </div>
                                            </TxLeft>

                                            <TxAmount $positive={signed >= 0}>
                                                {signed >= 0 ? "+" : "-"}
                                                {formatMoney(Math.abs(signed), heroCurrency)}
                                            </TxAmount>
                                        </TxRow>
                                    );
                                })}
                            </TxList>
                        )}
                    </Card>
                </Left>

                <Right>
                    <SideStack>
                        <Card>
                            <SideStat>
                                <div>
                                    <SideStatValue>
                                        {formatMoney(totalBalance, heroCurrency)}
                                    </SideStatValue>
                                    <SideStatLabel>Total available</SideStatLabel>
                                </div>
                                <div style={{ opacity: 0.7, textAlign: "right" }}>
                                    Cards: <strong>{paymentCards.length}</strong>
                                </div>
                            </SideStat>

                            <SideHint>
                                Quick summary based on your current cards and recent transactions.
                            </SideHint>
                        </Card>

                        <Card>
                            <Typography size="lg" weight="700">
                                Credit payments
                            </Typography>
                            {!creditCard ? (
                                <div style={{ marginTop: 10, opacity: 0.75 }}>
                                    You don't have a credit card yet.
                                    <div style={{ marginTop: 12 }}>
                                        <GhostBtn onClick={() => navigate("/cards/add")}>Create credit card</GhostBtn>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ marginTop: 10, opacity: 0.75 }}>
                                        Latest statement for card <strong>{creditCard.id}</strong>.
                                    </div>

                                    <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                                        {creditLoading ? (
                                            <div style={{ opacity: 0.7 }}>Loading statement…</div>
                                        ) : creditError ? (
                                            <div style={{ opacity: 0.85 }}>
                                                <div style={{ fontWeight: 800 }}>Failed to load</div>
                                                <div style={{ opacity: 0.75, marginTop: 4 }}>{creditError}</div>
                                            </div>
                                        ) : !latestStatement ? (
                                            <div style={{ opacity: 0.7 }}>
                                                No statements yet for this credit card.
                                            </div>
                                        ) : (
                                            <>
                                                <SideStat>
                                                    <div>
                                                        <SideStatValue>
                                                            {formatMoney(
                                                                latestStatement?.minPaymentDue ??
                                                                    latestStatement?.minimumPaymentDue ??
                                                                    0,
                                                                heroCurrency
                                                            )}
                                                        </SideStatValue>
                                                        <SideStatLabel>minimum payment</SideStatLabel>
                                                    </div>
                                                    <div style={{ opacity: 0.7, textAlign: "right" }}>
                                                        {latestStatement?.dueDate
                                                            ? format(safeDate(latestStatement.dueDate) || new Date(), "d MMM")
                                                            : "—"}
                                                        <div style={{ opacity: 0.7, fontSize: 12, marginTop: 2 }}>
                                                            due date
                                                        </div>
                                                    </div>
                                                </SideStat>

                                                <SideStat>
                                                    <div>
                                                        <SideStatValue>
                                                            {formatMoney(
                                                                latestStatement?.totalPaymentDue ??
                                                                    latestStatement?.totalDue ??
                                                                    0,
                                                                heroCurrency
                                                            )}
                                                        </SideStatValue>
                                                        <SideStatLabel>total due</SideStatLabel>
                                                    </div>
                                                    <div style={{ opacity: 0.7, textAlign: "right" }}>
                                                        <strong>{String(latestStatement?.status || "—")}</strong>
                                                        <div style={{ opacity: 0.7, fontSize: 12, marginTop: 2 }}>
                                                            status
                                                        </div>
                                                    </div>
                                                </SideStat>

                                                <div style={{ marginTop: 4 }}>
                                                    <GhostBtn onClick={() => navigate(`/cards/${creditCard.id}`)}>
                                                        Open credit card details
                                                    </GhostBtn>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </Card>
                    </SideStack>
                </Right>
            </LayoutGrid>
        </Wrapper>
    );
};

export default Dashboard;
