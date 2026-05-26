// src/components/ui/PhoneInput.jsx
import React from "react";
import styled from "styled-components";

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.borders.color};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary[500]};
  }
`;

const PhoneInput = ({ value, onChange, ...rest }) => {
    const handleChange = (e) => {
        let val = e.target.value;

        // Префикс фиксирован
        if (!val.startsWith("+994")) {
            val = "+994";
        }

        // Разрешить только цифры после +994
        const numbers = val.replace("+994", "").replace(/\D/g, "");

        // ограничение длины (max 12 символов после +994 → итого 13)
        const finalValue = "+994" + numbers.slice(0, 9);

        onChange({
            target: { name: rest.name, value: finalValue }
        });
    };

    return (
        <Input
            {...rest}
            value={value}
            onChange={handleChange}
        />
    );
};

export default PhoneInput;
