// src/pages/transactions/Utilities.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;        /* центрирование */
    gap: 24px;
    width: 100%;
`;

export const Grid = styled.div`
    display: grid;
    justify-content: center;    /* центрирование карточек */
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 18px;
    width: 100%;
    max-width: 600px;           /* чтобы карточки не разлетались */
`;

export const UtilityCard = styled.div`
    background: ${({ theme }) => theme.background.secondary};
    border: 1px solid ${({ theme }) => theme.borders.color};
    padding: 20px;
    border-radius: 12px;
    font-weight: 600;
    text-align: center;
    cursor: pointer;
    transition: 0.2s ease;

    &:hover {
        background: ${({ theme }) => theme.background.tertiary};
    }
`;

export const FormCard = styled.div`
    background: ${({ theme }) => theme.background.secondary};
    border: 1px solid ${({ theme }) => theme.borders.color};
    padding: 22px;
    border-radius: 12px;
    width: 100%;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

export const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const Label = styled.label`
    font-weight: 600;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text.primary};
`;
