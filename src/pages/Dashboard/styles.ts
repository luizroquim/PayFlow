import styled from "styled-components";

export const Container = styled.div`
  background-color: #e9eff5;
  min-height: 100vh;
  color: #d4e0f3;
  display: flex;
  flex-direction: column;
`;

export const MainContent = styled.main`
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 16px; // Reduzi levemente de 20px para ganhar mais espaço útil no celular

  @media (min-width: 768px) {
    padding: 40px 20px;
  }
`;

// --- SELETOR DE ABAS ---
export const TabContainer = styled.div`
  display: flex;
  gap: 4px; // Reduzi um pouco o gap para caber melhor em telas pequenas
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
  transition: all 0.2s;

  /* Garantindo o estado ativo/inativo */
  background-color: ${(props) => (props.$isActive ? "#ffffff" : "transparent")};
  box-shadow: ${(props) =>
    props.$isActive ? "0 2px 4px rgba(0, 0, 0, 0.05)" : "none"};

  color: ${(props) => {
    if (!props.$isActive) return "#64748b";
    return props.$tabType === "pendente" ? "#0284c7" : "#10b981";
  }};

  /* Ajuste para Desktop */
  @media (min-width: 480px) {
    flex: none;
    padding: 10px 25px;
    font-size: 0.9rem;
  }
`;

export const CardsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// --- ESTADOS VAZIOS ---
export const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  font-size: 0.95rem;

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

