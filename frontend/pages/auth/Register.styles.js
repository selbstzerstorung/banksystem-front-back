// src/pages/auth/Register.styles.js
import styled, { keyframes } from "styled-components";

/* Smooth fade-up animation */
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(12px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column; /* чтобы BackButton был сверху */
    align-items: center;
    padding: 40px 20px;
    animation: ${fadeIn} 0.35s ease;
`;

export const BackButton = styled.div`
    font-size: 0.95rem;
    cursor: pointer;
    opacity: 0.75;
    margin-bottom: 20px;
    width: 100%;
    max-width: 420px;
    color: ${({ theme }) => theme.primary[500]};
    font-weight: 500;
    transition: opacity 0.2s ease, transform 0.2s ease;

    &:hover {
        opacity: 1;
        transform: translateX(-4px);
    }
`;

export const Card = styled.div`
    width: 100%;
    max-width: 420px;
    background: ${({ theme }) => theme.background.card};
    padding: 32px;
    border-radius: 18px;
    box-shadow: ${({ theme }) => theme.shadows.md};
    transition: box-shadow 0.3s ease;

    &:hover {
        box-shadow: ${({ theme }) => theme.shadows.lg};
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const Field = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text.primary};
`;

export const Input = styled.input`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.borders.color};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.95rem;
  transition: border-color 0.2s ease, background 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.text.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary[500]};
    background: ${({ theme }) => theme.background.tertiary};
  }
`;

export const CheckboxRow = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    span {
        font-size: 0.9rem;
        color: ${({ theme }) => theme.text.primary};
    }
`;

export const ErrorBox = styled.div`
    padding: 12px 14px;
    background: rgba(220, 38, 38, 0.12);
    color: #dc2626;
    border-radius: 10px;

    display: flex;
    align-items: center;
    gap: 8px;

    border: 1px solid rgba(220, 38, 38, 0.35);
`;

export const SubmitBtn = styled.button`
    margin-top: 4px;
    padding: 13px;
    font-size: 1rem;
    background: ${({ theme }) => theme.primary[500]};
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;

    transition: background 0.2s ease, transform 0.15s ease;

    &:hover:not(:disabled) {
        background: ${({ theme }) => theme.primary[600]};
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.6;
        cursor: default;
    }
`;

export const BottomText = styled.div`
  margin-top: 16px;
  text-align: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};

  button {
    background: none;
    border: none;
    padding: 0;
    margin-left: 4px;
    cursor: pointer;

    color: ${({ theme }) => theme.primary[500]};
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: ${({ theme }) => theme.primary[600]};
    }
  }
`;
