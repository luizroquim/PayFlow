// src/pages/Dashboard/styles.ts
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