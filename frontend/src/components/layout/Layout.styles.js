// src/components/layout/Layout.styles.js
import styled from "styled-components";

export const LayoutWrapper = styled.div`
    width: 100%;
    min-height: 100vh;
    background: ${({ theme }) => theme.background.primary};
    display: flex;
    flex-direction: column;
`;

export const Main = styled.main`
    flex: 1;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
`;
