// src/pages/cards/CardsCarousel.styles.js
import styled from "styled-components";

// ---- WRAPPER ----
export const CarouselWrapper = styled.div`
    width: 100%;
    max-width: 420px;
    margin: 0 auto;
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding-top: 10px;
    padding-bottom: 20px;
`;

// ---- VIEWPORT ----
export const Viewport = styled.div`
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    position: relative;
`;

export const Track = styled.div`
    display: flex;
    transition: transform 0.35s ease;
`;

export const Slide = styled.div`
    min-width: 100%;
    display: flex;
    justify-content: center;
    padding: 10px 0;
`;

/* ---- CARD VISUAL (как в CardDetails) ---- */
export const CardBox = styled.div`
    width: 340px;
    height: 200px;
    border-radius: 18px;

    background: linear-gradient(
            135deg,
            ${({ theme }) => theme.primary[500]} 0%,
            ${({ theme }) => theme.primary[600]} 100%
    );
    


    display: flex;
    flex-direction: column;
    justify-content: space-between;

    transition: transform 0.25s ease, box-shadow 0.25s ease;

    &:hover {
        transform: translateY(-4px);
        box-shadow: ${({ theme }) => theme.shadows.md};
    }
`;

export const CardHeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    opacity: 0.95;
`;

export const CardScheme = styled.div`
    font-size: 1rem;
    letter-spacing: 1px;
    font-weight: 600;
`;

export const CardNumber = styled.div`
    font-size: 1.35rem;
    letter-spacing: 2px;
    font-weight: 600;
`;

export const CardFooterRow = styled.div`
    display: flex;
    justify-content: space-between;
    opacity: 0.9;
    font-size: 0.85rem;
`;

/* ---- DOTS ---- */
export const DotsWrapper = styled.div`
    margin-top: 12px;
    display: flex;
    justify-content: center;
    gap: 8px;
`;

export const Dot = styled.div`
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ active, theme }) =>
            active ? theme.primary[500] : theme.text.secondary};
    opacity: ${({ active }) => (active ? 1 : 0.4)};
    transition: 0.3s;
`;

export const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  background: rgba(0, 0, 0, 0.25);
  border: none;

  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  color: white;
  backdrop-filter: blur(4px);

  transition: 0.25s ease;

  &:hover {
    background: dimgray;
  }
`;

export const LeftArrow = styled(ArrowButton)`
  left: -55px;
`;

export const RightArrow = styled(ArrowButton)`
  right: -55px;
`;

