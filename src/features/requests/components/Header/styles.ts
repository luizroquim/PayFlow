import styled from "styled-components";

export const Header = styled.header`
  background-color: #ffffff;
  padding: 12px 16px; /* Padding reduzido para otimização de espaço mobile */
  display: flex;
  flex-direction: row; /* Mantém tudo na mesma linha horizontal no mobile */
  justify-content: space-between; /* Fixa a logo na esquerda e os botões na direita */
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 15px 40px;
  }

  .brand-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0; /* Impede a logo de achatar se a tela for muito pequena */

    .logo-box {
      background-color: #ffffff;
      color: #fff;
      padding: 1px;
      border-radius: 8px;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 2rem;
        height: 2rem;
      }
    }

    h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: #676989;

      /* 📱 Minimalismo: Esconde o título por extenso no mobile */
      @media (max-width: 767px) {
        display: none;
      }
    }
  }

  .user-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    width: auto;

    @media (min-width: 768px) {
      gap: 20px;
    }

    .user-email {
      display: none;

      @media (min-width: 768px) {
        display: block;
        font-size: 0.85rem;
        color: #64748b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    /* 📱 Controlando o botão "Nova Solicitação" herdado do seu componente UI */
    button,
    .btn-new-request {
      flex-shrink: 0;
@media (max-width: 767px) {
      order: 1; /* Permanece antes do avatar caso queira */
      width: 40px;
      height: 40px;
      padding: 0;
      justify-content: center;
      border-radius: 8px;
      
      /* Remove o texto mantendo apenas o ícone centralizado */
      font-size: 0; 
      svg {
        margin: 0;
        width: 18px;
        height: 18px;
      }
    }
      
    }

    /* 📱 Indicador do Usuário Minimalista (Avatar) */
    .user-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: #f1f5f9;
      color: #0284c7;
      font-size: 0.85rem;
      font-weight: bold;
      text-transform: uppercase;
      border: 1px solid #e2e8f0;
      flex-shrink: 0;

      @media (max-width: 767px) {
        order: 2; /* 🚀 COLOCA O AVATAR LOGO APÓS O BOTÃO NOVA SOLICITAÇÃO */
      }

      @media (min-width: 768px) {
        display: none; /* Esconde no desktop onde o e-mail completo reaparece */
      }
    }

    .btn-logout {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      transition: transform 0.2s;
      color: #64748b;
      flex-shrink: 0;

      @media (max-width: 767px) {
        order: 3; /* O botão de logout permanece como o último elemento à direita */
      }

      &:hover {
        transform: scale(1.1);
        color: ${({ theme }) => theme.colors.primaryHover || "#079cdc"};
      }
    }
  }
`;
