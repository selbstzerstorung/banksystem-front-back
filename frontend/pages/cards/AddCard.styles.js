// src/pages/cards/AddCard.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 40px 20px;
`;

export const Card = styled.div`
    width: 100%;
    max-width: 420px;
    background: ${({ theme }) => theme.background.card};
    padding: 32px;
    border-radius: 18px;
    box-shadow: ${({ theme }) => theme.shadows.md};
    display: flex;
    flex-direction: column;
    position: relative;
    animation: fadeIn 0.35s ease;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

/* ← Back button в левом верхнем углу блока Card */
export const BackButton = styled.div`
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    opacity: 0.75;
    color: ${({ theme }) => theme.primary[500]};
    transition: opacity 0.2s ease, transform 0.2s ease;

    margin-bottom: 16px;
    align-self: flex-start;

    &:hover {
        opacity: 1;
        transform: translateX(-4px);
    }
`;

export const Title = styled.h1`
    text-align: center;
    font-size: 1.6rem;
    font-weight: 600;
    margin-bottom: 4px;
    color: ${({ theme }) => theme.text.primary};
`;

export const Subtitle = styled.p`
    text-align: center;
    opacity: 0.7;
    margin-bottom: 22px;
    color: ${({ theme }) => theme.text.secondary};
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 18px;
`;

export const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;

    input[type="radio"] {
        margin-right: 6px;
    }
`;

export const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 600;
    color: ${({ theme }) => theme.text.primary};
`;

export const Input = styled.input`
    padding: 12px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.borders.color};
    background: ${({ theme }) => theme.background.primary};
    color: ${({ theme }) => theme.text.primary};
`;

export const Select = styled.select`
    padding: 12px;
    border-radius: 10px;
    border: 1px solid ${({ theme }) => theme.borders.color};
    background: ${({ theme }) => theme.background.primary};
    color: ${({ theme }) => theme.text.primary};
`;

export const ErrorBox = styled.div`
    padding: 12px;
    border-radius: 10px;
    background: rgba(255, 80, 80, 0.12);
    border: 1px solid rgba(255, 80, 80, 0.4);
    color: #ff6060;
    font-size: 0.9rem;
`;

export const SubmitBtn = styled.button`
    margin-top: 6px;
    padding: 13px;
    font-size: 1rem;
    background: ${({ theme }) => theme.primary[500]};
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;

    transition: background 0.2s ease, transform 0.15s ease;

    &:hover {
        background: ${({ theme }) => theme.primary[600]};
        transform: translateY(-2px);
    }
`;
