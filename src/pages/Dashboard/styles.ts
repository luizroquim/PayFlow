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
  padding: 20px;

  @media (min-width: 768px) {
    padding: 40px 20px;
  }
`;

// --- SELETOR DE ABAS ---
export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 25px;
  background-color: #f1f5f9;
  padding: 5px;
  border-radius: 12px;
  width: 100%;

  @media (min-width: 480px) {
    width: fit-content;
  }
`;

interface TabButtonProps {
  $isActive: boolean;
  $tabType: "pendente" | "comprado";
}

export const TabButton = styled.button<TabButtonProps>`
  flex: 1;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  background-color: ${(props) => (props.$isActive ? "#ffffff" : "transparent")};
  box-shadow: ${(props) =>
    props.$isActive ? "0 2px 4px rgba(0, 0, 0, 0.05)" : "none"};

  color: ${(props) => {
    if (!props.$isActive) return "#64748b";
    return props.$tabType === "pendente" ? "#0284c7" : "#10b981";
  }};

  @media (min-width: 480px) {
    flex: none;
    padding: 10px 25px;
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

// --- LINKS DE PAGINAÇÃO RESPONSIVA ---
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  width: 100%;
  flex-wrap: wrap;
`;

export const PaginationButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid
    ${(props) => (props.$isActive ? props.theme.colors.primary : "#cbd5e1")};
  background-color: ${(props) =>
    props.$isActive ? props.theme.colors.primary : "#ffffff"};
  color: ${(props) => (props.$isActive ? "#ffffff" : "#64748b")};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.$isActive ? props.theme.colors.primary : "#f8fafc"};
    border-color: ${(props) =>
      props.$isActive ? props.theme.colors.primary : "#94a3b8"};
    color: ${(props) => (props.$isActive ? "#ffffff" : "#334155")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
    border-color: #e2e8f0;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
`;