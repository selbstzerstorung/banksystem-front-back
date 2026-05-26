import React from "react";
import styled from "styled-components";

// NOTE:
// Use transient props ($...) so styled-components won't forward them to the DOM.

const variantStyles = {
  primary: ({ theme }) => `
    background: ${theme.primary[500]};
    color: ${theme.text.inverted};
    border: 1px solid transparent;

    &:hover {
      background: ${theme.primary[600]};
    }
  `,
  secondary: ({ theme }) => `
    background: ${theme.background.secondary};
    color: ${theme.text.primary};
    border: 1px solid ${theme.borders.color};

    &:hover {
      background: ${theme.background.primary};
    }
  `,
  ghost: ({ theme }) => `
    background: transparent;
    color: ${theme.text.primary};
    border: 1px solid transparent;

    &:hover {
      background: ${theme.background.secondary};
      border: 1px solid ${theme.borders.color};
    }
  `,
  danger: ({ theme }) => `
    background: ${theme.status.error};
    color: ${theme.text.inverted};
    border: 1px solid transparent;

    &:hover {
      filter: brightness(0.95);
    }
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border 0.2s ease, opacity 0.2s ease;
  user-select: none;
  text-decoration: none;

  ${({ $variant }) => variantStyles[$variant || "primary"]};

  ${({ $fullWidth }) =>
    $fullWidth &&
    `
      width: 100%;
    `}

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

// Keep API the same (<Button variant="secondary" fullWidth />)
// but map to transient props internally.
const Button = ({ variant, fullWidth, ...rest }) => (
  <StyledButton $variant={variant} $fullWidth={fullWidth} {...rest} />
);

export default Button;
