// src/components/ui/TextInput.jsx
import styled from "styled-components";

const TextInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.borders.color};
  background: ${({ theme }) => theme.background.primary};
  color: ${({ theme }) => theme.text.primary};
  font-size: 0.95rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${({ theme }) => theme.text.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.primary[500]}33;
  }

  &:disabled {
    opacity: 0.75;
    cursor: not-allowed;
    background: ${({ theme }) => theme.background.secondary};
  }
`;

export default TextInput;
