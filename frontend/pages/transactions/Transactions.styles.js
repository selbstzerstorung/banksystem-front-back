// src/pages/transactions/Transactions.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 26px;
`;

export const Tabs = styled.div`
    display: inline-flex;
    background: ${({ theme }) => theme.background.secondary};
    border: 1px solid ${({ theme }) => theme.borders.color};
    border-radius: 999px;
    padding: 4px;
    gap: 4px;
    width: fit-content;
`;

export const Tab = styled.button`
    appearance: none;
    border: 0;
    background: ${({ $active, theme }) =>
        $active ? theme.background.card : "transparent"};
    color: ${({ theme }) => theme.text.primary};
    font-weight: 800;
    font-size: 0.9rem;
    padding: 10px 14px;
    border-radius: 999px;
    cursor: pointer;
    opacity: ${({ $active }) => ($active ? 1 : 0.8)};

    &:hover {
        opacity: 1;
    }
`;

export const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

export const Item = styled.div`
    background: ${({ theme }) => theme.background.secondary};
    border: 1px solid ${({ theme }) => theme.borders.color};
    border-radius: 12px;
    padding: 16px;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Meta = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;

    > span:first-child {
        font-weight: 600;
        color: ${({ theme }) => theme.text.primary};
    }

    > span:last-child {
        font-size: 0.85rem;
        color: ${({ theme }) => theme.text.secondary};
    }
`;

export const Amount = styled.div`
    font-weight: 600;
    font-size: 1.1rem;
    color: ${({ $positive, theme }) => ($positive ? theme.primary[500] : "#ff4d4f")};
`;
