// src/pages/public/FeaturePreview.styles.js
import styled from "styled-components";

export const Page = styled.div`
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 16px 56px;

    @media (min-width: 1024px) {
        padding: 32px 0 64px;
    }
`;

export const Top = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const Hint = styled.div`
    font-size: 0.9rem;
    color: ${({ theme }) => theme.text.secondary};

    a {
        color: ${({ theme }) => theme.primary[500]};
        text-decoration: none;
        font-weight: 700;
    }

    a:hover {
        text-decoration: underline;
    }
`;

export const Title = styled.h1`
    margin: 0;
    font-size: 2rem;
    letter-spacing: -0.4px;
    color: ${({ theme }) => theme.text.primary};

    @media (min-width: 768px) {
        font-size: 2.25rem;
    }
`;

export const Subtitle = styled.p`
    margin: 0;
    color: ${({ theme }) => theme.text.secondary};
    line-height: 1.65;
    max-width: 72ch;
`;

export const Cta = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    background: ${({ theme }) => theme.background.card};
    border: 1px solid ${({ theme }) => theme.borders.color};
    border-radius: 18px;
    padding: 16px;
    box-shadow: ${({ theme }) => theme.shadows.sm};

    @media (max-width: 720px) {
        flex-direction: column;
        align-items: stretch;
    }
`;

export const CtaLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

export const CtaTitle = styled.div`
    font-weight: 900;
    color: ${({ theme }) => theme.text.primary};
`;

export const CtaText = styled.div`
    color: ${({ theme }) => theme.text.secondary};
    line-height: 1.6;
    max-width: 66ch;
`;

export const CtaActions = styled.div`
    display: flex;
    gap: 10px;
    flex-shrink: 0;

    @media (max-width: 720px) {
        width: 100%;
        > button {
            flex: 1;
        }
    }
`;

export const Grid = styled.div`
    margin-top: 18px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;

    @media (max-width: 980px) {
        grid-template-columns: 1fr;
    }
`;

export const PreviewCard = styled.div`
    background: ${({ theme }) => theme.background.card};
    border: 1px solid ${({ theme }) => theme.borders.color};
    border-radius: 18px;
    padding: 18px;
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const CardTitle = styled.div`
    font-weight: 900;
    color: ${({ theme }) => theme.text.primary};
`;

export const CardText = styled.p`
    margin: 10px 0 0;
    color: ${({ theme }) => theme.text.secondary};
    line-height: 1.6;
`;

export const BulletList = styled.ul`
    margin: 12px 0 0;
    padding-left: 18px;
    color: ${({ theme }) => theme.text.secondary};
    display: grid;
    gap: 6px;
`;

export const Bullet = styled.li``;
