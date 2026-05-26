import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
`;

export const Container = styled.div`
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Hero = styled.section`
  padding: 56px 0 24px;
`;

export const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 26px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const HeroCard = styled.div`
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.color};
  border-radius: 18px;
  padding: 28px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const HeroTitle = styled.h1`
  margin: 0;
  font-size: 2.3rem;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.text.primary};

  @media (max-width: 520px) {
    font-size: 1.9rem;
  }
`;

export const HeroText = styled.p`
  margin: 12px 0 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.text.secondary};
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const Stat = styled.div`
  background: ${({ theme }) => theme.background.secondary};
  border: 1px solid ${({ theme }) => theme.borders.color};
  border-radius: 16px;
  padding: 16px;
`;

export const StatNum = styled.div`
  font-size: 1.2rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
`;

export const StatLabel = styled.div`
  margin-top: 6px;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text.secondary};
`;

export const Section = styled.section`
  padding: 22px 0;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 1.45rem;
  color: ${({ theme }) => theme.text.primary};
`;

export const SectionSubtitle = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.55;
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const ProductCard = styled.div`
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.color};
  border-radius: 18px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const ProductTitle = styled.div`
  font-weight: 800;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.text.primary};
`;

export const ProductText = styled.p`
  margin: 10px 0 0;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.55;
`;

export const Bullets = styled.ul`
  margin: 12px 0 0;
  padding: 0 0 0 18px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
`;

export const Bullet = styled.li`
  margin: 6px 0;
`;

export const Split = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const Info = styled.div`
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.color};
  border-radius: 18px;
  padding: 18px;
`;

export const InfoTitle = styled.div`
  font-weight: 800;
  color: ${({ theme }) => theme.text.primary};
`;

export const InfoText = styled.p`
  margin: 10px 0 0;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
`;

export const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const PriceCard = styled.div`
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.color};
  border-radius: 18px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  display: flex;
  flex-direction: column;
  min-height: 210px;
`;

export const PriceTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const PriceName = styled.div`
  font-weight: 900;
  letter-spacing: 0.2px;
  color: ${({ theme }) => theme.text.primary};
`;

export const PriceValue = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
`;

export const PriceMeta = styled.div`
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.95rem;
`;

export const PriceDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.borders.color};
  margin: 14px 0;
`;

export const FaqWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
`;

export const FaqItem = styled.div`
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.color};
  border-radius: 18px;
  overflow: hidden;
`;

export const FaqQuestion = styled.button`
  width: 100%;
  text-align: left;
  padding: 16px 18px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text.primary};
  font-weight: 800;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: ${({ theme }) => theme.background.secondary};
  }
`;

export const FaqAnswer = styled.div`
  padding: 0 18px 16px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
`;

export const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr 1.2fr;
  gap: 14px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const ContactCard = styled.div`
  background: ${({ theme }) => theme.background.card};
  border: 1px solid ${({ theme }) => theme.borders.color};
  border-radius: 18px;
  padding: 18px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const ContactTitle = styled.div`
  font-weight: 900;
  color: ${({ theme }) => theme.text.primary};
`;

export const ContactText = styled.div`
  margin-top: 10px;
  color: ${({ theme }) => theme.text.secondary};
  line-height: 1.6;
`;

export const FooterNote = styled.div`
  padding: 22px 0 44px;
  color: ${({ theme }) => theme.text.secondary};
  font-size: 0.9rem;
  line-height: 1.55;
`;
