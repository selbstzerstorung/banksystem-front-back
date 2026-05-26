// src/components/ui/Section.jsx
import styled from "styled-components";

const Section = styled.section`
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 16px 40px;

    @media (min-width: 1024px) {
        padding: 32px 0 48px;
    }
`;

export default Section;
