import styled from "styled-components";

export const ContainerAcoes = styled.div`
  /* Mantém o comportamento normal no computador (lado a lado) */
  display: flex;
  justify-content: flex-end; 
  gap: 12px;
  margin-top: 24px;
  width: 100%;

  /* 📱 Configuração EXCLUSIVA para o Mobile */
  @media (max-width: 767px) {
    flex-direction: column-reverse; /* Coloca um botão debaixo do outro (Ação principal em cima) */
    gap: 10px;
    
    /* Força os botões a esticarem apenas no telemóvel */
    button {
      width: 100%;
      justify-content: center;
      padding: 14px; /* Aumenta a área de toque para o polegar */
    }
  }
`;