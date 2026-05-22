import styled from "styled-components";

export const CardsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  width: 100%;
`;

// 🎯 CORRIGIDO: Adicionamos o prefixo transiente "$" na tipagem da interface
interface PaginationButtonProps {
  $isActive?: boolean;
}

export const PaginationButton = styled.button<PaginationButtonProps>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid ${(props) => (props.$isActive ? "#079cdc" : "#cbd5e1")};
  background-color: ${(props) => (props.$isActive ? "#079cdc" : "#fff")};
  color: ${(props) => (props.$isActive ? "#fff" : "#475569")};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$isActive ? "#079cdc" : "#f8fafc")};
    border-color: ${(props) => (props.$isActive ? "#079cdc" : "#94a3b8")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;