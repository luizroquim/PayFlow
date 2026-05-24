import styled from "styled-components";

export const Overlay = styled.div<{ $fullScreenOnMobile?: boolean }>`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  box-sizing: border-box;

  /* 📱 Ajusta alinhamento do overlay apenas para modais que ocupam tela cheia */
  @media (max-width: 768px) {
    align-items: ${(props) =>
      props.$fullScreenOnMobile ? "flex-start" : "center"};
    justify-content: center;
    overflow-y: auto;
    padding: 0;
  }
`;

/* 🎯 Adicionada a propriedade $fullScreenOnMobile */
export const Content = styled.div<{
  $maxWidth: string;
  $fullScreenOnMobile?: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: ${(props) => props.$maxWidth};
  background-color: #fff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSwoosh 0.2s ease-out;
  box-sizing: border-box;
  color: #1e293b;

  /* Comportamento Desktop */
  max-height: 90vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 768px) {
    /* 🚀 A MÁGICA ACONTECE AQUI: Condicional de estilo via Propriedade */
    ${(props) =>
      props.$fullScreenOnMobile
        ? `
      /* 📱 Comportamento de Ecrã Inteiro com PROTEÇÃO PARA iPHONE */
      margin: 0;
      min-height: 100dvh;
      max-height: none;
      overflow-y: visible;
      border-radius: 0;
      width: 100%;
      padding-top: calc(20px + env(safe-area-inset-top));
      padding-bottom: calc(20px + env(safe-area-inset-bottom));
      padding-left: calc(16px + env(safe-area-inset-left));
      padding-right: calc(16px + env(safe-area-inset-right));
    `
        : `
      /* 📦 Comportamento de Caixinha Centralizada (Modais pequenos) */
      margin: 16px;
      width: calc(100% - 32px);
      max-height: calc(100dvh - 32px);
      overflow-y: auto;
      
      /* Mantém a proteção do fundo caso a caixinha desça muito perto da barra do iPhone */
      padding-top: 20px;
      padding-bottom: calc(20px + env(safe-area-inset-bottom));
      padding-left: 16px;
      padding-right: 16px;
    `}
  }

  @keyframes modalSwoosh {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  h3,
  h2,
  h4 {
    margin: 0 0 4px 0;
    color: #0f172a !important;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .modal-description {
    font-size: 0.9rem;
    color: #64748b !important;
    margin: 0 0 10px 0;
    line-height: 1.5;
  }

  .finalizar-acoes-container {
    display: flex;
    justify-content: center;
    gap: 12px;
    width: 100%;
    margin-top: 20px;
  }
`;

export const ConfirmContent = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: modalSwoosh 0.2s ease-out;
  box-sizing: border-box;

  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    /* 🚀 BLINDAGEM: Garante que modais pequenos (como o de excluir) 
       continuem sendo "caixinhas" centralizadas com respiro nas laterais */
    margin: 16px;
    width: calc(100% - 32px);

    /* Proteção nativa para o fundo do iPhone caso o modal pequeno seja longo */
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
  }

  h3 {
    font-size: 1.2rem;
    color: #0f172a;
    margin-bottom: 8px;
    font-weight: 700;
  }

  p {
    font-size: 0.95rem;
    color: #64748b;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
`;
