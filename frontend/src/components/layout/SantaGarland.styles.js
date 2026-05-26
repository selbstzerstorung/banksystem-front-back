// src/components/layout/SantaGarland.styles.js
import styled, { keyframes } from "styled-components";

const twinkle = keyframes`
  0%, 100% { opacity: 0.85; filter: brightness(1); }
  50% { opacity: 1; filter: brightness(1.25); }
`;

const gentleSway = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(1px); }
`;

export const GarlandWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 26px;
  pointer-events: none;
  z-index: 5;
`;

export const Wire = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 15px;
  height: 2px;
  background: linear-gradient(
    to right,
    rgba(248, 245, 239, 0.05),
    rgba(248, 245, 239, 0.16),
    rgba(248, 245, 239, 0.05)
  );
  opacity: 0.9;
`;

export const BulbRow = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  animation: ${gentleSway} 2.8s ease-in-out infinite;
`;

export const Bulb = styled.span`
  position: relative;
  width: 10px;
  height: 14px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
  box-shadow: ${({ $glow }) => $glow};
  opacity: 0.95;
  animation: ${twinkle} 1.6s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}ms;

  &::before {
    content: "";
    position: absolute;
    width: 6px;
    height: 4px;
    border-radius: 999px;
    background: rgba(0,0,0,0.25);
    transform: translate(2px, -5px);
  }
`;

export const TailButton = styled.button`
  pointer-events: auto;
  position: absolute;
  right: 10px;
  top: 0;
  width: 26px;
  height: 26px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: grid;
  place-items: center;
  padding: 0;
`;

export const Tail = styled.div`
  width: 2px;
  height: 18px;
  background: rgba(248, 245, 239, 0.35);
  border-radius: 999px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -2px;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: rgba(248, 245, 239, 0.25);
    border: 1px solid rgba(248, 245, 239, 0.25);
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  }
`;
