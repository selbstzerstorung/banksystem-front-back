// src/pages/dashboard/Dashboard.styles.js
import styled from "styled-components";
import { motion } from "framer-motion";

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 30px;
`;

export const PageTitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
`;

export const LayoutGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 18px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Right = styled.div`
  @media (max-width: 980px) {
    order: -1;
  }
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.color};
  border-radius: 20px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const HeroCard = styled(Card)`
  position: relative;
  overflow: hidden;
  padding: 22px;

  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.primary[500]},
    ${({ theme }) => theme.primary[600]}
  );
  color: #fff;
  border: 0;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  &::before {
    content: "";
    position: absolute;
    inset: -80px -120px auto auto;
    width: 320px;
    height: 320px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.14);
    filter: blur(0px);
  }

  &::after {
    content: "";
    position: absolute;
    inset: auto -100px -140px auto;
    width: 420px;
    height: 420px;
    border-radius: 999px;
    background: rgba(0, 0, 0, 0.18);
  }
`;

export const HeroTop = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const HeroCardName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  opacity: 0.95;
`;

export const AddCardBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.18);
  }
`;

export const HeroBalance = styled.div`
  position: relative;
  z-index: 2;
  margin-top: 10px;
  font-size: 2.7rem;
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: 0.4px;
`;

export const HeroMeta = styled.div`
  position: relative;
  z-index: 2;
  margin-top: 10px;
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  opacity: 0.95;
  font-size: 0.92rem;

  strong {
    font-weight: 800;
  }
`;

export const HeroActions = styled.div`
  position: relative;
  z-index: 2;
  margin-top: 16px;

  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const ActionBtn = styled.button`
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  padding: 12px 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.18);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
`;

export const ActionIcon = styled.span`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.18);
`;

export const GhostBtn = styled.button`
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.borders.color};
  background: ${({ theme }) => theme.background.secondary};
  color: ${({ theme }) => theme.text.primary};
  padding: 10px 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease,
    background 0.15s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
    background: ${({ theme }) => theme.background.card};
  }
`;

// (kept for future use)
export const AddCardBtnLegacy = AddCardBtn;

export const SectionTitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const Tabs = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 3px;
  border: 1px solid ${({ theme }) => theme.borders.color};
  background: ${({ theme }) => theme.background.secondary};
`;

export const Tab = styled.button`
  border: 0;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.92rem;
  color: ${({ theme, $active }) => ($active ? theme.text.primary : theme.text.secondary)};
  background: ${({ theme, $active }) => ($active ? theme.background.card : "transparent")};
  box-shadow: ${({ theme, $active }) => ($active ? theme.shadows.sm : "none")};
`;

export const OpsGrid = styled.div`
  margin-top: 14px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 16px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.borders.color};
  background: ${({ theme }) => theme.background.secondary};
  font-weight: 700;
  color: ${({ theme }) => theme.text.primary};

  span {
    font-weight: 600;
    opacity: 0.72;
    white-space: nowrap;
  }
`;

export const DonutWrap = styled.div`
  position: relative;
  border-radius: 18px;
  border: 1px solid ${({ theme }) => theme.borders.color};
  background: ${({ theme }) => theme.background.secondary};
  overflow: hidden;
  padding: 12px 10px;
`;

export const DonutCenter = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  text-align: center;
`;

export const TxList = styled.div`
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const TxRow = styled(motion.div)`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.borders.color};
  border-radius: 16px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const TxLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

export const TxIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.color};
  flex: 0 0 auto;
`;

export const TxName = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 520px;

  @media (max-width: 560px) {
    max-width: 240px;
  }
`;

export const TxDate = styled.div`
  font-size: 0.88rem;
  color: ${({ theme }) => theme.text.muted};
  margin-top: 2px;
`;

export const TxAmount = styled.div`
  font-weight: 900;
  white-space: nowrap;
  color: ${({ theme, $positive }) => ($positive ? theme.status.success : theme.status.error)};
`;

export const SideStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (min-width: 981px) {
    position: sticky;
    top: 18px;
  }
`;

export const SideStat = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SideStatValue = styled.div`
  font-size: 1.4rem;
  font-weight: 900;
`;

export const SideStatLabel = styled.div`
  font-size: 0.92rem;
  color: ${({ theme }) => theme.text.muted};
  margin-top: 2px;
`;

export const SideHint = styled.div`
  margin-top: 12px;
  font-size: 0.92rem;
  color: ${({ theme }) => theme.text.muted};
  line-height: 1.35;
`;

// Backward-compatible exports (some old imports might exist)
export const HeroMetaLegacy = HeroMeta;
