// src/pages/public/FeaturePreview.jsx
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "../../components/ui/Button";

import {
    Page,
    Top,
    Title,
    Subtitle,
    Grid,
    PreviewCard,
    CardTitle,
    CardText,
    BulletList,
    Bullet,
    Cta,
    CtaLeft,
    CtaTitle,
    CtaText,
    CtaActions,
    Hint,
} from "./FeaturePreview.styles";

const FeaturePreview = ({
    eyebrow,
    title,
    subtitle,
    highlights = [],
    primaryCta = { label: "Create account", to: "/register" },
    secondaryCta = { label: "Log in", to: "/login" },
}) => {
    const navigate = useNavigate();

    return (
        <Page className="fade-in">
            <Top>
                {eyebrow && <Hint>{eyebrow}</Hint>}
                <Title>{title}</Title>
                {subtitle && <Subtitle>{subtitle}</Subtitle>}

                <Cta>
                    <CtaLeft>
                        <CtaTitle>Want full access?</CtaTitle>
                        <CtaText>
                            Log in to create cards, see balances, make transfers, and use all utilities.
                        </CtaText>
                    </CtaLeft>

                    <CtaActions>
                        <Button onClick={() => navigate(primaryCta.to)}>{primaryCta.label}</Button>
                        <Button variant="secondary" onClick={() => navigate(secondaryCta.to)}>
                            {secondaryCta.label}
                        </Button>
                    </CtaActions>
                </Cta>
            </Top>

            <Grid>
                {highlights.map((h) => (
                    <PreviewCard key={h.title}>
                        <CardTitle>{h.title}</CardTitle>
                        <CardText>{h.text}</CardText>
                        {h.bullets?.length ? (
                            <BulletList>
                                {h.bullets.map((b) => (
                                    <Bullet key={b}>{b}</Bullet>
                                ))}
                            </BulletList>
                        ) : null}
                    </PreviewCard>
                ))}
            </Grid>

            <Hint style={{ marginTop: 18 }}>
                Back to <Link to="/">Home</Link>.
            </Hint>
        </Page>
    );
};

export default FeaturePreview;
