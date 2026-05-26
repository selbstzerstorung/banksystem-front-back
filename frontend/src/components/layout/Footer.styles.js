// src/components/layout/Footer.styles.js
import styled from "styled-components";

export const FooterBar = styled.footer`
    width: 100%;
    padding: 16px 0;
    text-align: center;
    background: ${({ theme }) => theme.footer?.bg || theme.background.secondary};
    border-top: 1px solid
    ${({ theme }) => theme.footer?.border || theme.borders.color};
    margin-top: auto;
`;

export const FooterText = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.footer?.text || theme.text.secondary};
    font-size: 0.85rem;
`;
