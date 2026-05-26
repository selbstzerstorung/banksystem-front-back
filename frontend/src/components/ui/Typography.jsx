// src/components/ui/Typography.jsx
import React from "react";
import styled, { css } from "styled-components";

const sizes = {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
};

const weights = {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
};

// Use transient props ($size, $weight) to avoid forwarding unknown props to DOM.
const Text = styled.p`
    margin: 0;
    ${({ $size }) =>
            $size &&
            css`
      font-size: ${sizes[$size] || sizes.md};
    `};
    ${({ $weight }) =>
            $weight &&
            css`
      font-weight: ${weights[$weight] || weights.normal};
    `};
    ${({ color, theme }) =>
            color === "muted" &&
            css`
      color: ${theme.text.secondary};
    `}
`;

const Typography = ({
                        as = "p",
                        size = "md",
                        weight = "normal",
                        color,
                        children,
                        ...rest
                    }) => {
    return (
        <Text as={as} $size={size} $weight={weight} color={color} {...rest}>
            {children}
        </Text>
    );
};

export default Typography;
