// src/components/ui/PasswordInput.jsx
import React, { useState } from "react";
import styled from "styled-components";
import { Eye, EyeOff } from "lucide-react";
import TextInput from "./TextInput";

const Wrapper = styled.div`
    position: relative;
`;

const Toggle = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.text.secondary};
`;

const PasswordInput = ({ ...props }) => {
    const [visible, setVisible] = useState(false);

    return (
        <Wrapper>
            <TextInput
                {...props}
                type={visible ? "text" : "password"}
                autoComplete="current-password"
            />
            <Toggle
                type="button"
                onClick={() => setVisible((v) => !v)}
                aria-label={visible ? "Hide password" : "Show password"}
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </Toggle>
        </Wrapper>
    );
};

export default PasswordInput;
