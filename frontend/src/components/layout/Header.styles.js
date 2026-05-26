// src/components/layout/Header.styles.js
import styled from "styled-components";

export const HeaderBar = styled.header`
    width: 100%;
    height: 64px;
    position: relative;
    z-index: 10;
    overflow: hidden;
    background: ${({ theme }) => theme.header?.bg || theme.background.secondary};
    border-bottom: 1px solid
    ${({ theme }) => theme.header?.border || theme.borders.color};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    box-shadow: ${({ theme }) => theme.shadows.sm};
`;

export const Logo = styled.div`
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    color: ${({ theme }) => theme.text.primary};

    &:hover {
        opacity: 0.8;
    }
`;

export const Nav = styled.nav`
    display: flex;
    align-items: center;
    gap: 18px;
`;

export const NavItem = styled.div`
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    color: ${({ theme }) => theme.text.primary};
    padding: 6px 10px;
    border-radius: 6px;
    transition: 0.15s ease;

    &.active {
        background: ${({ theme }) => theme.primary[500]};
        color: #fff;
    }

    &:hover {
        background: ${({ theme }) => theme.background.card};
    }
`;

export const RightSide = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const ProfileBtn = styled.div`
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    background: ${({ theme }) => theme.background.card};
    border: 1px solid ${({ theme }) => theme.borders.color};
    color: ${({ theme }) => theme.text.primary};
    font-weight: 500;
    font-size: 0.9rem;
    transition: 0.15s ease;

    &:hover {
        border-color: ${({ theme }) => theme.primary[500]};
    }
`;

export const UserName = styled.span`
    font-size: 0.95rem;
    font-weight: 500;
    color: ${({ theme }) => theme.text.primary};
`;

export const LogoutBtn = styled.button`
    background: ${({ theme }) => theme.primary[500]};
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: 0.15s ease;

    &:hover {
        background: ${({ theme }) => theme.primary[600]};
    }
`;

export const AuthLink = styled.div`
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
    background: ${({ theme }) => theme.background.card};
    border: 1px solid ${({ theme }) => theme.borders.color};
    color: ${({ theme }) => theme.text.primary};
    font-weight: 500;
    font-size: 0.9rem;
    transition: 0.15s ease;

    &:hover {
        border-color: ${({ theme }) => theme.primary[500]};
    }
`;

export const AuthPrimary = styled.button`
    background: ${({ theme }) => theme.primary[500]};
    color: white;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: 0.15s ease;

    &:hover {
        background: ${({ theme }) => theme.primary[600]};
    }
`;
