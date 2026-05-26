import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import Button from "../../components/ui/Button";

import {
  Page,
  Container,
  Hero,
  HeroGrid,
  HeroCard,
  HeroTitle,
  HeroText,
  HeroActions,
  StatGrid,
  Stat,
  StatNum,
  StatLabel,
  Section,
  SectionTitle,
  SectionSubtitle,
  CardsGrid,
  ProductCard,
  ProductTitle,
  ProductText,
  Bullets,
  Bullet,
  Split,
  Info,
  InfoTitle,
  InfoText,
  PricingGrid,
  PriceCard,
  PriceTop,
  PriceName,
  PriceValue,
  PriceMeta,
  PriceDivider,
  FaqWrap,
  FaqItem,
  FaqQuestion,
  FaqAnswer,
  ContactGrid,
  ContactCard,
  ContactTitle,
  ContactText,
  FooterNote,
} from "./Home.styles";

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  const goLogin = () => navigate("/login");
  const goRegister = () => navigate("/register");
  const goDashboard = () => navigate("/dashboard");

  const cards = useMemo(
    () => [
      {
        title: "Debit Card",
        text: "Everyday payments with your own balance and instant history.",
        bullets: [
          "Fast card creation",
          "Clear balance and history",
          "Transfers between accounts",
        ],
      },
      {
        title: "Credit Card",
        text: "Credit limit with statement cycle logic and minimum payment flow.",
        bullets: [
          "Limit + current debt",
          "Statements & due dates",
          "Grace-period repayment",
        ],
      },
      {
        title: "Digital Security",
        text: "Built to feel like real banking apps with safe auth patterns.",
        bullets: [
          "HttpOnly refresh cookie",
          "Short-lived access token",
          "CORS configured for dev",
        ],
      },
    ],
    []
  );

  const features = useMemo(
    () => [
      {
        title: "Dashboard",
        text: "Quick overview of balances, recent activity, and shortcuts to your cards.",
        path: "/dashboard",
      },
      {
        title: "Cards",
        text: "Create, view, and manage debit/credit cards. See details & transactions.",
        path: "/cards",
      },
      {
        title: "Transfers",
        text: "Send money between cards/accounts with validation and server-side checks.",
        path: "/transfer",
      },
      {
        title: "Utilities",
        text: "Transaction filters, history view, and analytics-style summaries.",
        path: "/utilities",
      },
    ],
    []
  );

  const pricing = useMemo(
    () => [
      {
        name: "Basic",
        value: "0₼",
        meta: "Monthly fee",
        bullets: ["Debit card", "Transfers", "History & filters"],
      },
      {
        name: "Plus",
        value: "0₼",
        meta: "In demo version",
        bullets: ["Credit card", "Statement cycle", "Minimum payment UI"],
      },
      {
        name: "Premium",
        value: "0₼",
        meta: "In demo version",
        bullets: ["All features", "Priority support (mock)", "Extra analytics (planned)"],
      },
    ],
    []
  );

  const faqs = useMemo(
    () => [
      {
        q: "Is this a real bank?",
        a: "No. Santa Bank is a learning/demo project. It imitates banking UX and connects to a Spring Boot backend for local development.",
      },
      {
        q: "What is the difference between operations and transactions?",
        a: "In the UI, “Transactions” usually means the ledger records (debit/credit movements). “Operations” can be a broader grouping: transfers, card actions, payments, fees — anything that results in one or more transactions.",
      },
      {
        q: "How does login work?",
        a: "The backend issues a short-lived access token and a refresh token stored in an HttpOnly cookie. The frontend refreshes the access token when needed.",
      },
      {
        q: "Can I edit my profile?",
        a: "The profile edit UI is included. If your backend endpoint is not connected yet, the UI will remain in “ready” state until you add the API.",
      },
    ],
    []
  );

  return (
    <Page className="fade-in">
      <Hero>
        <Container>
          <HeroGrid>
            <HeroCard>
              <HeroTitle>Santa Bank</HeroTitle>
              <HeroText>
                A modern demo-bank UI for learning: cards, transfers, analytics, and a clean
                fintech experience — powered by your Spring Boot backend.
              </HeroText>
              <HeroActions>
                {isAuthenticated ? (
                  <Button onClick={goDashboard}>Open Dashboard</Button>
                ) : (
                  <>
                    <Button onClick={goRegister}>Create account</Button>
                    <Button variant="secondary" onClick={goLogin}>
                      Log in
                    </Button>
                  </>
                )}
              </HeroActions>
            </HeroCard>

            <StatGrid>
              <Stat>
                <StatNum>2</StatNum>
                <StatLabel>Card types</StatLabel>
              </Stat>
              <Stat>
                <StatNum>24/7</StatNum>
                <StatLabel>Access</StatLabel>
              </Stat>
              <Stat>
                <StatNum>0₼</StatNum>
                <StatLabel>Monthly fee</StatLabel>
              </Stat>
              <Stat>
                <StatNum>Secure</StatNum>
                <StatLabel>JWT + cookies</StatLabel>
              </Stat>
            </StatGrid>
          </HeroGrid>
        </Container>
      </Hero>

      <Section>
        <Container>
          <SectionTitle>Cards</SectionTitle>
          <SectionSubtitle>
            Choose the card that fits your scenario. Debit for everyday spending, credit for
            flexible payments and limits.
          </SectionSubtitle>

          <CardsGrid>
            {cards.map((c) => (
              <ProductCard key={c.title}>
                <ProductTitle>{c.title}</ProductTitle>
                <ProductText>{c.text}</ProductText>
                <Bullets>
                  {c.bullets.map((b) => (
                    <Bullet key={b}>{b}</Bullet>
                  ))}
                </Bullets>
              </ProductCard>
            ))}
          </CardsGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>What you can do in the app</SectionTitle>
          <SectionSubtitle>
            A simple structure like in real banks: dashboard for overview, cards for account
            management, transfer for money movement, and utilities for helpers.
          </SectionSubtitle>

          <Split>
            {features.map((f) => (
              <Info key={f.title}>
                <InfoTitle>{f.title}</InfoTitle>
                <InfoText>{f.text}</InfoText>

                {/* Preview links for guests (Cards/Utilities/Transfer), and normal navigation for authed */}
                {f.path && (
                  <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {isAuthenticated ? (
                      <Button variant="secondary" onClick={() => navigate(f.path)}>
                        Open
                      </Button>
                    ) : f.path === "/dashboard" ? (
                      <Button variant="secondary" onClick={goLogin}>
                        Log in to open
                      </Button>
                    ) : (
                      <Button variant="secondary" onClick={() => navigate(f.path)}>
                        Preview
                      </Button>
                    )}
                  </div>
                )}
              </Info>
            ))}
          </Split>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>Plans & pricing</SectionTitle>
          <SectionSubtitle>
            This project is a demo, so pricing is intentionally simple — but the UI is ready
            for real tariffs.
          </SectionSubtitle>

          <PricingGrid>
            {pricing.map((p) => (
              <PriceCard key={p.name}>
                <PriceTop>
                  <PriceName>{p.name}</PriceName>
                  <PriceValue>{p.value}</PriceValue>
                  <PriceMeta>{p.meta}</PriceMeta>
                </PriceTop>
                <PriceDivider />
                <Bullets>
                  {p.bullets.map((b) => (
                    <Bullet key={b}>{b}</Bullet>
                  ))}
                </Bullets>
              </PriceCard>
            ))}
          </PricingGrid>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>Security</SectionTitle>
          <SectionSubtitle>
            Banking UX is all about trust. This demo uses a safe approach for local dev:
            HttpOnly refresh cookie + access token for requests.
          </SectionSubtitle>

          <Split>
            <Info>
              <InfoTitle>Refresh cookie</InfoTitle>
              <InfoText>
                The refresh token is stored in an HttpOnly cookie, so it can’t be read by
                JavaScript.
              </InfoText>
            </Info>
            <Info>
              <InfoTitle>Short-lived access token</InfoTitle>
              <InfoText>
                The UI attaches an access token to API calls, and refreshes it when it
                expires.
              </InfoText>
            </Info>
            <Info>
              <InfoTitle>Strict CORS (dev)</InfoTitle>
              <InfoText>
                Backend allows only your frontend origin (localhost:3000) and credentials.
              </InfoText>
            </Info>
            <Info>
              <InfoTitle>Server-side validation</InfoTitle>
              <InfoText>
                Transfers, card limits, and auth checks are validated on the backend.
              </InfoText>
            </Info>
          </Split>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>FAQ</SectionTitle>
          <SectionSubtitle>Quick answers to the most common questions.</SectionSubtitle>

          <FaqWrap>
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <FaqItem key={item.q}>
                  <FaqQuestion
                    type="button"
                    onClick={() => setOpenFaq((cur) => (cur === idx ? -1 : idx))}
                    aria-expanded={isOpen}
                  >
                    {item.q}
                  </FaqQuestion>
                  {isOpen && <FaqAnswer>{item.a}</FaqAnswer>}
                </FaqItem>
              );
            })}
          </FaqWrap>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>Contact</SectionTitle>
          <SectionSubtitle>
            For a demo project, contacts are placeholders — but the section is styled like a
            real product.
          </SectionSubtitle>

          <ContactGrid>
            <ContactCard>
              <ContactTitle>Support</ContactTitle>
              <ContactText>support@Santa.bank</ContactText>
              <ContactText>Mon–Sun: 24/7 (demo)</ContactText>
            </ContactCard>
            <ContactCard>
              <ContactTitle>Office</ContactTitle>
              <ContactText>Baku, Azerbaijan</ContactText>
              <ContactText>Business hours: 10:00–19:00</ContactText>
            </ContactCard>
            <ContactCard>
              <ContactTitle>Get started</ContactTitle>
              <ContactText>Create an account and add your first card.</ContactText>
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {isAuthenticated ? (
                  <Button onClick={goDashboard}>Open Dashboard</Button>
                ) : (
                  <>
                    <Button onClick={goRegister}>Create account</Button>
                    <Button variant="secondary" onClick={goLogin}>
                      Log in
                    </Button>
                  </>
                )}
              </div>
            </ContactCard>
          </ContactGrid>
        </Container>
      </Section>

      <FooterNote>
        <Container>
          This is a learning/demo project. Santa Bank is not a real financial
          institution. Any tokens/cookies in the browser are for local development only.
        </Container>
      </FooterNote>
    </Page>
  );
};

export default Home;
