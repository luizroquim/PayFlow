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
  gap: 6px;
  margin-top: 32px;
  width: 100%;
  flex-wrap: wrap; // Essencial para telas pequenas
  align-items: center;

  @media (max-width: 768px) {
    margin-bottom: 30px; /* No celular, dá uma folga ainda maior se precisar */
    gap: 4px; /* Deixa os botões mais juntinhos no celular para garantir que não quebre */
  }

`;

interface PaginationButtonProps {
  $isActive?: boolean;
}

export const PaginationButton = styled.button<PaginationButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  /* UX Mobile: Tamanho mínimo de toque (44px) em telas pequenas */
  min-height: 30px;
  min-width: 30px;
  padding: 8px 12px;
  
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$isActive ? "#079cdc" : "#e2e8f0")};
  background-color: ${(props) => (props.$isActive ? "#079cdc" : "#fff")};
  color: ${(props) => (props.$isActive ? "#fff" : "#475569")};
  
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  /* Efeito de escala leve no toque (modernidade) */
  &:active {
    transform: scale(0.95);
  }

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$isActive ? "#079cdc" : "#f1f5f9")};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background-color: #f8fafc;
  }

  /* Ajuste para botões de texto "Anterior/Próximo" */
  &:first-child, &:last-child {
    min-width: auto;
    padding: 8px 16px;
  }

  span {
    display: none;
  }

  @media (min-width: 480px) {
    span {
      display: inline;
      margin-left: 4px;
    }
  }

  @media (max-width: 480px) {
    padding: 8px;
    min-width: 32px;
    
  }
`;