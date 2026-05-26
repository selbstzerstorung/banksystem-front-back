// src/components/ui/Card.jsx
import styled from "styled-components";

const Card = styled.div`
    background: ${({ theme }) => theme.background.card};
    border-radius: 16px;
    padding: 20px 18px;
    box-shadow: ${({ theme }) => theme.shadows.md};
    border: 1px solid ${({ theme }) => theme.borders.subtle};
`;

export default Card;
