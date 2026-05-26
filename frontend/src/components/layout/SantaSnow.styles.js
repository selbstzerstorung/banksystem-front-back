// src/components/layout/SantaSnow.styles.js
import styled, { keyframes } from "styled-components";

const fall = keyframes`
  0% { transform: translate3d(0, -12vh, 0); }
  100% { transform: translate3d(0, 112vh, 0); }
`;

const sway = keyframes`
  0%, 100% { transform: translate3d(-10px, 0, 0); }
  50% { transform: translate3d(10px, 0, 0); }
`;

// Full-screen overlay. pointer-events: none so it never blocks clicks.
export const SnowWrap = styled.div`
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;

  /* Keep snow subtle so the UI stays readable */
  opacity: 0.55;
`;

export const Flake = styled.span`
  position: absolute;
  left: ${({ $left }) => $left}%;
  top: 0;

  animation: ${fall} ${({ $duration }) => $duration}s linear infinite;
  animation-delay: ${({ $delay }) => $delay}s;
  opacity: ${({ $opacity }) => $opacity};

  /* reduce aliasing shimmer on some screens */
  will-change: transform;
`;

export const Dot = styled.span`
  display: block;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 999px;

  background: rgba(248, 245, 239, 0.92);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.16);

  animation: ${sway} ${({ $swayDuration }) => $swayDuration}s ease-in-out infinite;
  will-change: transform;
`;
