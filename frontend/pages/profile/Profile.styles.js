// src/pages/profile/Profile.styles.js
import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Subtitle = styled.div`
  margin-top: 6px;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.95rem;
`;

export const Actions = styled.div`
  display: inline-flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
`;

export const Hero = styled.div`
  margin-top: 16px;
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.subtle || theme.borders.color};
  border-radius: 18px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.md};

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
`;

export const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 260px;
`;

export const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: ${({ theme }) => theme.text.primary};

  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.borders.subtle || theme.borders.color};
`;

export const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HeroTitle = styled.div`
  line-height: 1.1;
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

export const CopyButton = styled.button`
  border: 1px solid ${({ theme }) => theme.borders.subtle || theme.borders.color};
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};
  border-radius: 12px;
  padding: 10px 12px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.15s;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${({ theme }) => theme.borders.subtle || theme.borders.color};
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};
  border-radius: 999px;
  padding: 8px 10px;
  font-weight: 700;
  font-size: 0.85rem;
`;

export const BadgeDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ theme, $variant }) =>
    $variant === "error" ? theme.status.error : theme.status.success};
`;

export const Grid = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
`;

export const InfoCard = styled.div`
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.subtle || theme.borders.color};
  border-radius: 16px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

export const CardTitle = styled.div`
  font-size: 1rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  margin-bottom: 12px;
`;

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${({ theme }) => theme.borders.subtle || theme.borders.color};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

export const RowLabel = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
  font-weight: 700;
`;

export const RowValue = styled.div`
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 700;
  text-align: right;
`;

export const InlineNote = styled.div`
  margin-top: 10px;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 500px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FieldLabel = styled.label`
  font-weight: 800;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FieldHint = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.text.secondary};
`;

export const FieldError = styled.div`
  font-size: 0.82rem;
  color: ${({ theme }) => theme.status.error};
  font-weight: 700;
`;

export const Banner = styled.div`
  margin-top: 10px;
  border-radius: 14px;
  padding: 12px 12px;
  border: 1px solid ${({ theme }) => theme.borders.subtle || theme.borders.color};
  background: ${({ theme }) => theme.background.secondary};
`;

export const BannerText = styled.div`
  font-size: 0.88rem;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 700;
`;
