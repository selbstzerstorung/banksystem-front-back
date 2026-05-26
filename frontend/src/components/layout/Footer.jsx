// src/components/layout/Footer.jsx
import React from "react";
import { FooterBar, FooterText } from "./Footer.styles";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <FooterBar>
            <FooterText>© {year} Santa Bank. All rights reserved.</FooterText>
        </FooterBar>
    );
};

export default Footer;
