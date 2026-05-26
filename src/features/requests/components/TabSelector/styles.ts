// src/features/requests/components/TabSelector/styles.ts
import styled from "styled-components";

export const TabContainer = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  background-color: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  width: 100%;

  @media (min-width: 480px) {
    width: fit-content;
    gap: 8px;
    padding: 5px;
  }
`;

interface TabButtonProps {
  $isActive: boolean;
  $tabType: "pendente" | "comprado";
}

export const TabButton = styled.button<TabButtonProps>`
  flex: 1;
  padding: 12px 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: ${props => props.theme.transitions.fast};
  display: flex;
  align-items: center;
  justify-content: center;

  /* Estado ativo/inativo */
  background-color: ${(props) => (props.$isActive ? props.theme.colors.background : "transparent")};
  box-shadow: ${(props) => (props.$isActive ? "0 2px 4px rgba(0, 0, 0, 0.05)" : "none")};

  color: ${(props) => {
    if (!props.$isActive) return props.theme.colors.textSecondary; // #64748b
    return props.$tabType === "pendente" ? props.theme.colors.primary : props.theme.colors.success;
  }};

  @media (min-width: 480px) {
    flex: none;
    padding: 10px 25px;
    font-size: 0.9rem;
  }
`;

// 🔢 Balãozinho numérico para a aba de Pendentes
export const BadgeCount = styled.span<{ $isActive: boolean }>`
  background-color: ${props => props.$isActive ? props.theme.colors.loginAction : '#e2e8f0'};
  color: ${props => props.$isActive ? props.theme.colors.white : props.theme.colors.textSecondary};
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 100px;
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
  min-width: 18px;
`;

// 🟢 Bolinha de novidade para a aba de Concluídas
export const NewNotificationDot = styled.span`
  width: 12px;
  height: 12px;
  background-color: ${props => props.theme.colors.success};
  border-radius: 50%;
  display: inline-block;
  margin-left: 6px;
  vertical-align: middle;

  will-change: transform, opacity;
  
  /* Pisca suavemente para indicar novidade */
  animation: pulseAlpha 1.5s infinite ease-in-out;

  @keyframes pulseAlpha {
    0% { opacity: 0.5; transform: scale(0.9); }
    50% { opacity: 1; transform: scale(1.1); }
    100% { opacity: 0.5; transform: scale(0.9); }
  }
`;