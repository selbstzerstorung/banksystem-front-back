import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

// --- скрываем пропсы, которые НЕ должны попадать в DOM ---
const Field = styled.input.withConfig({
    shouldForwardProp: (prop) => !["error"].includes(prop),
})`
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.95rem;
  width: 100%;

  border: 1px solid
    ${({ theme, error }) => (error ? theme.status.error : theme.borders.color)};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme, error }) => (error ? theme.status.error : theme.text.primary)};

  &::placeholder {
    color: ${({ theme }) => theme.text.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, error }) =>
    error ? theme.status.error : theme.primary[500]};
  }
`;

const Label = styled.label`
    font-size: 0.9rem;
    font-weight: 600;
`;

const ErrorText = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.status.error};
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`;

const Input = ({ label, error, ...props }) => {
    return (
        <Wrapper>
            {label && <Label>{label}</Label>}
            <Field {...props} error={Boolean(error)} />
            {error && <ErrorText>{error}</ErrorText>}
        </Wrapper>
    );
};

Input.propTypes = {
    label: PropTypes.string,
    error: PropTypes.string,
};

export default Input;
