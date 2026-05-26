import React from "react";
import styled from "styled-components";

const ToasterWrap = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: grid;
  gap: 10px;
  max-width: 360px;
`;

const Toast = styled.div`
  border-radius: 14px;
  padding: 12px 14px;
  background: ${({ theme }) => theme?.bg2 || "#111827"};
  border: 1px solid rgba(148,163,184,.25);
  box-shadow: 0 18px 50px rgba(0,0,0,.35);
  color: ${({ theme }) => theme?.text || "#f8fafc"};
  display: grid;
  gap: 4px;
`;

const Title = styled.div`
  font-weight: 900;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const Message = styled.div`
  font-size: 13px;
  opacity: .9;
  line-height: 1.35;
`;

const CloseBtn = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  color: inherit;
  opacity: .7;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 2px 6px;
  border-radius: 8px;

  &:hover { opacity: 1; }
  &:focus { outline: 2px solid rgba(148,163,184,.55); outline-offset: 2px; }
`;

const badgeByType = (type) => {
  switch (type) {
    case "success":
      return "✅";
    case "warning":
      return "⚠️";
    case "error":
      return "⛔";
    default:
      return "ℹ️";
  }
};

export default function Toaster({ items = [], onRemove }) {
  if (!items.length) return null;
  return (
    <ToasterWrap aria-live="polite" aria-relevant="additions">
      {items.map((t) => (
        <Toast key={t.id} role="status">
          <Title>
            <span>
              {badgeByType(t.type)} {t.title}
            </span>
            <CloseBtn aria-label="Close notification" onClick={() => onRemove?.(t.id)}>
              ×
            </CloseBtn>
          </Title>
          <Message>{t.message}</Message>
        </Toast>
      ))}
    </ToasterWrap>
  );
}
