import styled from "styled-components";

export const ContainerAcoes = styled.div`
  display: flex;
  justify-content: flex-end; /* No Desktop: alinha os botões à direita */
  gap: 12px;
  margin-top: 24px;
  width: 100%;

  /* 📱 No Mobile: Empilha os botões um abaixo do outro com largura máxima */
  @media (max-width: 767px) {
    flex-direction: column-reverse; /* Dica de UX: Ação principal (Confirmar) fica em cima */
    gap: 10px;
    
    button {
      width: 100%;
      justify-content: center;
      padding: 14px; 
    }
  }
`;