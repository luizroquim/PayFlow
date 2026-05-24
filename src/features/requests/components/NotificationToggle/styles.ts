// src/components/NotificationToggle/styles.ts
import styled from 'styled-components';

export const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 400px; /* Limita o tamanho para não esticar demais */
`;

export const HeaderArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;

  svg {
    color: #079cdc;
  }
`;

export const Title = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

export const Description = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 16px;
  background-color: #079cdc;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0284c7;
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%; /* No mobile o botão vira block total para facilitar o toque */
    padding: 12px;
  }
`;