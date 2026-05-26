import { css } from 'styled-components';

// Flexbox mixins
export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

export const flexColumnCenter = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// Grid mixins
export const grid = (columns = '1fr', gap = '1rem') => css`
  display: grid;
  grid-template-columns: ${columns};
  gap: ${gap};
`;

export const gridAuto = (minWidth = '250px', gap = '1rem') => css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${minWidth}, 1fr));
  gap: ${gap};
`;

// Typography mixins
export const textEllipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const multilineEllipsis = (lines = 2) => css`
  display: -webkit-box;
  -webkit-line-clamp: ${lines};
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// Animation mixins
export const fadeIn = css`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  animation: fadeIn 0.3s ease;
`;

export const slideIn = css`
  @keyframes slideIn {
    from {
      transform: translateY(-20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  animation: slideIn 0.3s ease;
`;

export const slideInLeft = css`
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  animation: slideInLeft 0.3s ease;
`;

export const slideInRight = css`
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  animation: slideInRight 0.3s ease;
`;

export const pulse = css`
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
  
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
`;

export const spin = css`
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  animation: spin 1s linear infinite;
`;

// Card mixins
export const cardShadow = css`
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
                0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

export const glassEffect = css`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

// Button mixins
export const buttonReset = css`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  background: none;
  color: inherit;
  font: inherit;
  line-height: normal;
  cursor: pointer;
  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;
  appearance: none;
  
  &:focus {
    outline: none;
  }
`;

export const buttonPrimary = css`
  ${buttonReset}
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-500);
  color: white;
  border-radius: var(--borders-radius-md);
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-600);
    transform: translateY(-1px);
    box-shadow: var(--shadows-md);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Input mixins
export const inputBase = css`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid var(--borders-color);
  border-radius: var(--borders-radius-md);
  background-color: var(--background-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 3px var(--primary-100);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--background-secondary);
  }
  
  &::placeholder {
    color: var(--text-tertiary);
  }
`;

// Responsive mixins
export const mobile = (styles) => css`
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    ${styles}
  }
`;

export const tablet = (styles) => css`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    ${styles}
  }
`;

export const desktop = (styles) => css`
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    ${styles}
  }
`;

// Scrollbar mixins
export const customScrollbar = css`
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--background-secondary);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-500);
    border-radius: 4px;
    
    &:hover {
      background: var(--primary-600);
    }
  }
  
  &::-webkit-scrollbar-corner {
    background: var(--background-secondary);
  }
`;

// Selection mixin
export const customSelection = css`
  &::selection {
    background-color: var(--primary-100);
    color: var(--primary-900);
  }
  
  &::-moz-selection {
    background-color: var(--primary-100);
    color: var(--primary-900);
  }
`;