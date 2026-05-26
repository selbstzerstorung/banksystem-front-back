// src/pages/cards/CardDetails.styles.js
import styled, { keyframes } from "styled-components";

/* entrance animation */
const fadeInUp = keyframes`
    from { opacity: 0; transform: translateY(10px) scale(.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 28px;
    animation: ${fadeInUp} 0.3s ease;
`;

export const CardLayout = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    align-items: flex-start;
`;

/* =======================
   FLIP CARD
======================== */

export const CardFlipContainer = styled.div`
    width: 340px;
    height: 210px;
    perspective: 1200px;
    cursor: pointer;
`;

export const CardFlipInner = styled.div`
    width: 100%;
    height: 100%;
    position: relative;

    transform-style: preserve-3d;
    transition: transform 0.65s cubic-bezier(0.55,0.6,0.35,1);

    transform: ${({ rotated }) =>
            rotated ? "rotateY(180deg)" : "rotateY(0deg)"};
`;

/* FRONT SIDE */

export const CardFront = styled.div`
    position: absolute;
    inset: 0;
    padding: 22px;
    border-radius: 22px;

    background: linear-gradient(135deg, #0f172a, #1e40af, #1e293b);
    color: white;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    backface-visibility: hidden;
    transform-style: preserve-3d;

    box-shadow: 0 18px 40px rgba(0,0,0,0.45);

    &:hover {
        transform: translateY(-4px) scale(1.03);
    }
`;

export const CardFrontTop = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const CardScheme = styled.div`
    font-size: 1.25rem;
    font-weight: 700;
`;

export const CardFrontActions = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
`;

export const EyeButton = styled.button`
    appearance: none;
    border: none;
    background: rgba(255,255,255,0.18);
    color: #fff;
    width: 34px;
    height: 34px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    cursor: pointer;
    line-height: 1;

    &:hover {
        background: rgba(255,255,255,0.26);
    }

    &:active {
        transform: scale(0.98);
    }
`;

export const CardTypePill = styled.div`
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.25);
    font-size: .8rem;
`;

export const CardNumberBig = styled.div`
    font-size: 1.25rem;
    letter-spacing: 3px;
`;

export const CardFrontBottom = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const CardHolderText = styled.div`
    display: flex;
    flex-direction: column;
`;

export const CardHolderTextRight = styled(CardHolderText)`
    align-items: flex-end;
    text-align: right;
`;

export const CardLabelSmall = styled.div`
    opacity: .7;
    font-size: .7rem;
`;

export const CardValueStrong = styled.div`
    font-weight: 600;
`;

/* BACK SIDE */

export const CardBack = styled.div`
    position: absolute;
    inset: 0;
    padding: 20px;
    border-radius: 22px;

    background: linear-gradient(135deg, #1e293b, #0f172a);
    color: white;

    transform: rotateY(180deg);
    backface-visibility: hidden;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &::before {
        content: "";
        position: absolute;
        top: 25px;
        left: 0;
        height: 40px;
        width: 100%;
        background: black;
        opacity: 0.75;
    }
`;

export const CvvBox = styled.div`
    align-self: flex-end;
    background: white;
    padding: 8px 14px;
    color: black;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1rem;
`;

export const CardBackFooter = styled.div`
    font-size: .75rem;
    opacity: .7;
`;

/* DETAILS PANEL */

export const CardBox = styled.div`
    flex: 1;
    min-width: 260px;
    padding: 20px;
    border-radius: 16px;

    background: ${({ theme }) => theme.background.secondary};
    border: 1px solid ${({ theme }) => theme.borders.color};
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const Section = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

export const Row = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px solid ${({ theme }) => theme.borders.color};
`;

export const Label = styled.div`
    font-size: .9rem;
    color: ${({ theme }) => theme.text.secondary};
    font-weight: 600;
`;

export const Value = styled.div`
    font-size: .9rem;
    color: ${({ theme }) => theme.text.primary};
`;

export const CreditInfo = styled.div`
    margin-top: 10px;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.borders.color};
    background: ${({ theme }) => theme.background.tertiary};
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const CreditText = styled.div`
    font-size: .85rem;
`;

export const ProgressBar = styled.div`
    width: 100%;
    height: 7px;
    background: ${({ theme }) => theme.background.primary};
    border-radius: 5px;
`;

export const ProgressFill = styled.div`
    width: ${({ percent }) => percent}%;
    height: 100%;
    background: ${({ percent }) =>
            percent < 50  ? "#4CAF50"
                    : percent < 80  ? "#FFC107"
                            : "#F44336"};
    transition: width .3s ease;
`;

export const Actions = styled.div`
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

/* TRANSACTIONS */

export const TxSection = styled.div`
    margin-top: 20px;
`;

export const TxList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const TxItem = styled.div`
    padding: 10px 14px;
    border-radius: 12px;

    background: ${({ theme }) => theme.background.secondary};
    border: 1px solid ${({ theme }) => theme.borders.color};

    display: flex;
    justify-content: space-between;
`;

export const TxLeft = styled.div`
    display: flex;
    flex-direction: column;
`;

export const TxRight = styled.div`
    font-weight: 700;
    text-align: right;
`;
