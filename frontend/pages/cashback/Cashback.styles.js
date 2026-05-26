// src/pages/cashback/Cashback.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.subtle || theme.borders.color};
  border-radius: 16px;
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

// Backwards-compatible aliases used by Cashback.jsx.
// Keep these exports to prevent "Module not found" / undefined component crashes.
export const BalanceCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

export const Hint = styled.div`
  margin-top: 6px;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.text.muted};
`;

export const Error = styled.div`
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid rgba(220, 38, 38, 0.25);
  color: ${({ theme }) => theme.status.error};
  font-weight: 800;
  font-size: 0.9rem;
`;

export const Balance = styled.div`
  font-size: 2rem;
  font-weight: 900;
`;

export const Form = styled.form`
  display: grid;
  gap: 12px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text.secondary};
`;

export const Inline = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

export const Msg = styled.div`
  font-size: 0.9rem;
  font-weight: 800;
  color: ${({ theme, $type }) => ($type === "error" ? theme.status.error : theme.status.success)};
`;
