// src/pages/cards/CardsCarousel.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    CarouselWrapper,
    Viewport,
    Track,
    Slide,
    LeftArrow,
    RightArrow,
    DotsWrapper,
    Dot
} from "./CardsCarousel.styles";

import { useNavigate } from "react-router-dom";
import { useCards } from "../../contexts/CardsContext";
import { isPaymentCard } from "../../utils/cardGuards";

const CardsCarousel = ({ cards = [], onChange }) => {
    const navigate = useNavigate();
    const { currentCardId, setCurrentCard } = useCards();

  const displayCards = useMemo(() => (cards || []).filter(isPaymentCard), [cards]);

  const indexFromContext = useMemo(() => {
        if (!displayCards.length) return 0;
        const idx = displayCards.findIndex((c) => Number(c?.id) === Number(currentCardId));
        return idx >= 0 ? idx : 0;
    }, [displayCards, currentCardId]);

    const [index, setIndex] = useState(indexFromContext);

    // Keep local index in sync with context (and vice versa)
    useEffect(() => {
        setIndex(indexFromContext);
    }, [indexFromContext]);

    useEffect(() => {
        if (!displayCards.length) return;
        const selected = displayCards[index];
        if (selected?.id != null) {
            // Avoid spamming selectCard when carousel index is already in sync.
            if (Number(selected.id) !== Number(currentCardId)) {
                setCurrentCard(selected.id);
            }
            onChange?.(index, selected.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, displayCards, currentCardId]);

    if (!displayCards || displayCards.length === 0) {
        return <p>No cards yet.</p>;
    }

    const goLeft = () => setIndex((prev) => (prev === 0 ? displayCards.length - 1 : prev - 1));
    const goRight = () => setIndex((prev) => (prev === displayCards.length - 1 ? 0 : prev + 1));

    return (
        <CarouselWrapper>

            {/* LEFT ARROW */}
            <LeftArrow onClick={(e) => { e.stopPropagation(); goLeft(); }}>
                ❮
            </LeftArrow>

            {/* SLIDER */}
            <Viewport>
                <Track style={{ transform: `translateX(-${index * 100}%)` }}>
                    {displayCards.map((card) => (
                        <Slide key={card.id}>
                            <div
                                onClick={() => navigate(`/cards/${card.id}`)}
                                style={{
                                    width: "380px",          // BIGGER CARD
                                    height: "240px",         // BIGGER CARD
                                    borderRadius: "22px",
                                    padding: "24px",
                                    color: "white",
                                    background:
                                        "linear-gradient(135deg, #0f172a, #1e293b, #334155)",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-between",
                                    cursor: "pointer",

                                    transition: "0.25s ease"
                                }}
                            >
                                {/* TOP ROW */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between"
                                }}>
                                    <span style={{ fontSize: "1.1rem", opacity: 0.85 }}>
                                        SantaBank
                                    </span>

                                    <span style={{
                                        fontSize: "0.9rem",
                                        background: "rgba(255,255,255,0.18)",
                                        padding: "4px 12px",
                                        borderRadius: "14px"
                                    }}>
                                        {String(card.type || "").toUpperCase()}
                                    </span>
                                </div>

                                {/* CARD NUMBER */}
                                <div style={{
                                    fontSize: "1.6rem",
                                    letterSpacing: "3px",
                                    fontWeight: 500
                                }}>
                                    •••• •••• •••• {String(card.number || card.id || "").slice(-4)}
                                </div>

                                {/* BOTTOM ROW */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "1rem",
                                    opacity: 0.85
                                }}>
                                    <span>{String(card.status || "ACTIVE")}</span>
                                    <span>{card.expires ? `EXP ${card.expires}` : ""}</span>
                                </div>

                            </div>
                        </Slide>
                    ))}
                </Track>
            </Viewport>

            {/* RIGHT ARROW */}
            <RightArrow onClick={(e) => { e.stopPropagation(); goRight(); }}>
                ❯
            </RightArrow>

            {/* DOTS */}
            <DotsWrapper>
                {displayCards.map((_, i) => (
                    <Dot
                        key={i}
                        active={i === index}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIndex(i);
                        }}
                    />
                ))}
            </DotsWrapper>
        </CarouselWrapper>
    );
};

export default CardsCarousel;
