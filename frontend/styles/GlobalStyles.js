// src/styles/GlobalStyles.js
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;

        transition:
                background-color 0.25s ease,
                color 0.25s ease,
                border-color 0.25s ease,
                fill 0.25s ease,
                stroke 0.25s ease;
    }

    body {
        font-family: 'Inter', sans-serif;
        background: ${({ theme }) => theme.background.primary};
        color: ${({ theme }) => theme.text.primary};
        line-height: 1.6;

        transition:
                background-color 0.4s ease,
                color 0.4s ease;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    ::selection {
        background: ${({ theme }) => theme.primary[300]};
        color: white;
    }

    /* Fade-in animation for page transitions */
    .fade-in {
        opacity: 0;
        animation: fadeIn 0.35s ease forwards;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(4px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .page-enter {
        opacity: 0;
        transform: translateY(12px);
    }

    .page-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.35s ease, transform 0.35s ease;
    }

    .page-exit {
        opacity: 1;
        transform: translateY(0);
    }

    .page-exit-active {
        opacity: 0;
        transform: translateY(-12px);
        transition: opacity 0.25s ease, transform 0.25s ease;
    }

`;

export default GlobalStyles;