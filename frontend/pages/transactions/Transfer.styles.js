// src/pages/transactions/Transfer.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

export const FormCard = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.borders.color};
  padding: 22px;
  border-radius: 12px;
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
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

export const Select = styled.select`
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.borders.color};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary[500]};
  }
`;

export const Helper = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text.secondary};
`;

export const Message = styled.div`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid
    ${({ theme, $variant }) =>
      $variant === "error" ? theme.status.error : theme.status.success};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme, $variant }) =>
    $variant === "error" ? theme.status.error : theme.status.success};
`;
