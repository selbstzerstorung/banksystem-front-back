// src/pages/cards/CardList.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const Title = styled.h2`
    font-size: 1.4rem;
    font-weight: 700;
    color: ${({ theme }) => theme.text.primary};
`;

export const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const AddCardButton = styled.button`
    padding: 10px 18px;
    background: ${({ theme }) => theme.primary[500]};
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 0.95rem;
    cursor: pointer;
    font-weight: 600;

    transition: 0.2s ease;

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
        transform: none;
    }

    &:disabled:hover {
        background: ${({ theme }) => theme.primary[500]};
        transform: none;
    }

    &:hover {
        background: ${({ theme }) => theme.primary[600]};
        transform: translateY(-2px);
    }
`;

export const TxList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const TxItem = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 14px 16px;
    border-radius: 14px;
    background: ${({ theme }) => theme.background.card};
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const TxLeft = styled.div`
    display: flex;
    flex-direction: column;
`;

export const TxRight = styled.div`
    font-weight: 600;
    text-align: right;
`;
