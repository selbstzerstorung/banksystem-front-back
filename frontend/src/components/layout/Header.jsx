// src/components/layout/Header.jsx
import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { useThemeContext } from "../../contexts/ThemeContext";
import ThemeToggle from "../ui/ThemeToggle";
import SantaGarland from "./SantaGarland";

import {
    HeaderBar,
    Logo,
    Nav,
    NavItem,
    RightSide,
    UserName,
    LogoutBtn,
    ProfileBtn,
    AuthPrimary,
} from "./Header.styles";

const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const { user } = useUser();
    const navigate = useNavigate();
    const { theme } = useThemeContext();

    return (
        <HeaderBar>
            {theme === "santa" ? <SantaGarland /> : null}
            <Logo onClick={() => navigate("/")}>Santa Bank</Logo>

            <Nav>
                {isAuthenticated && (
                    <NavItem as={NavLink} to="/dashboard">
                        Dashboard
                    </NavItem>
                )}

                <NavItem as={NavLink} to="/cards">
                    Cards
                </NavItem>
                <NavItem as={NavLink} to="/utilities">
                    Utilities
                </NavItem>
                <NavItem as={NavLink} to="/transfer">
                    Transfer
                </NavItem>

                {isAuthenticated && (
                    <NavItem as={NavLink} to="/cashback">
                        Cashback
                    </NavItem>
                )}
            </Nav>

            <RightSide>
                <ThemeToggle />

                {isAuthenticated && (
                    <>
                        <ProfileBtn as={Link} to="/profile">
                            Profile
                        </ProfileBtn>

                        <UserName>{user?.name}</UserName>

                        <LogoutBtn type="button" onClick={logout}>
                            Logout
                        </LogoutBtn>
                    </>
                )}

                {!isAuthenticated && (
                    <>
                        <ProfileBtn as={Link} to="/login">
                            Login
                        </ProfileBtn>
                        <AuthPrimary type="button" onClick={() => navigate("/register")}>
                            Create account
                        </AuthPrimary>
                    </>
                )}
            </RightSide>
        </HeaderBar>
    );
};

export default Header;
