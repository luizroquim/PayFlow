import styled from "styled-components";
import { Button } from "../../components/UI";


export const CardContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  /* Efeito moderno ao tocar no card no mobile */
  &:active {
    transform: scale(0.99);
  }

  @media (min-width: 768px) {
    padding: 24px;
  }

  /* 🎯 Caso queira adicionar alguma estilização baseada no status no futuro, use as classes abaixo: */
  &.card-status-pendente {
    /* Ex: border-left: 4px solid #f0f0f0; */
  }

  &.card-status-comprado {
    /* Ex: border-left: 4px solid #1aac7c; */
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;

    h3 {
      margin: 0 0 4px 0;
      font-size: 1.15rem;
      color: #0f172a;
      font-weight: 700;
    }

    .requested-by {
      margin: 0;
      font-size: 0.85rem;
      color: #64748b;
    }
  }

  .card-description {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #334155;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .card-links {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;

    a,
    button {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.8rem;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s ease-in-out;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }

    .link-payment-info {
      background-color: #f0fdf4;
      color: #166534;
      border: 1px solid #bbf7d0;

      &:hover {
        background-color: #dcfce7;
      }
    }

    .link-product {
      background-color: #f0f9ff;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }

    .link-invoice {
      background-color: #fcf3ce;
      color: #88560b;
      border: 1px solid #f3e1a5;
    }

    .link-receipt {
      background-color: #f0fdf4;
      color: #166534;
      border: 1px solid #dcfce7;
    }
  }

  .card-dates {
    font-size: 0.75rem;
    color: #94a3b8;
    display: flex;
    flex-direction: column;
    gap: 6px;

    span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    @media (min-width: 480px) {
      flex-direction: row;
      gap: 20px;
    }

    .payment-date {
      display: flex;
      align-items: center;
      color: #10b981;
      font-weight: bold;
      gap: 3px;
    }
  }

  .card-footer-actions {
    display: flex;
    flex-direction: column;
    gap: 12px;
    border-top: 1px solid #f1f5f9;
    padding-top: 15px;

    @media (min-width: 480px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .user-actions {
      display: flex;
      gap: 12px;
      width: 100%;

      @media (min-width: 480px) {
        width: auto;
      }

    button {
        /* UX Mobile: Tamanho mínimo de toque 44px */
        min-height: 44px; 
        padding: 0 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        
        &:active {
          transform: scale(0.96);
        }
      }

      .btn-edit {
        flex: 1;
        border: 1px solid #e2e8f0;
        background-color: #fff;
        color: #334155;

        @media (min-width: 480px) {
          flex: none;
        }

        &:hover {
          background-color: #f8fafc;
        }
      }

      .btn-delete {
        border: 1px solid #fee2e2;
        color: #ef4444;
        background-color: #fff;

        &:hover {
          background-color: #fef2f2;
        }
      }
    }

    .btn-confirm-payment {
      min-height: 44px;
      width: 100%;
      background-color: #1aac7c;
      color: #fff;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.2s ease, transform 0.1s ease;

      &:active {
        transform: scale(0.98);
        
      }

      @media (min-width: 480px) {
        width: auto;
      }

      &:hover {
        background-color: #059669;
      }
    }
  }
`;

// 🎯 BLINDADO: Utilizando propriedade transiente ($status) para o Badge não vazar no DOM nativo
export const Badge = styled.span<{ $status: string }>`
  display: flex;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  gap: 4px;
  white-space: nowrap;
  background-color: ${(props) =>
    props.$status === "pendente" ? "#f0f0f0" : "#1aac7c"};
  color: ${(props) => (props.$status === "pendente" ? "#3b3b3b" : "white")};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;

  @media (max-width: 768px) {
    align-items: flex-start;
    overflow-y: auto;
    padding: 16px 12px;
    -webkit-overflow-scrolling: touch;
  }
`;

// 🎯 CORRIGIDO: Propriedade transformada em transiente ($maxWidth) para limpar os alertas do React
export const ModalContent = styled.div<{ $maxWidth: string }>`
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: fit-content;
  min-width: 360px;
  max-width: min(95vw, 720px);
  background-color: #fff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  max-height: calc(100vh - 80px);
  overflow-y: auto;

  @media (max-width: 768px) {
    margin-top: 10px;
    margin-bottom: 30px;
    padding: 20px 16px;
    min-width: auto;
    width: 100%;
    max-width: 100%;
  }
`;

export const AlertaCancelamento = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  /* 🎯 INTEGRADO AO SEU THEME: Usa os fallbacks seguros baseados no design system do projeto */
  background-color: ${props => props.theme.colors?.white === '#ffffff' ? '#f8fafc' : props.theme.colors?.white}; 
  border-left: 3px solid ${props => props.theme.colors?.primary || '#0284c7'}; 
  
  padding: 10px 12px;
  border-radius: 0 6px 6px 0;
  margin-bottom: 14px;
  font-size: 0.82rem;
  
  /* Usa a cor primária padrão do tema para manter a harmonia */
  color: ${props => props.theme.colors?.primary || '#0284c7'};

  .header-alerta {
    display: flex;
    align-items: center;
    gap: 6px; 
    
    /* Usa a cor de destaque principal do tema para o ícone */
    color: ${props => props.theme.colors?.primary || '#0284c7'}; 
  }

  p {
    margin: 0;
    /* Usa a cor primária ou um fallback escuro estável */
    color: #475569;
    margin-top: 2px;
    
    strong {
      color: ${props => props.theme.colors?.primaryHover || '#079cdc'};
    }
  }

  .badge-erro {
    font-weight: 600;
    color: ${props => props.theme.colors?.primaryHover || '#079cdc'};
    font-size: 0.8rem;
  }

  .status-aguarda {
    font-size: 0.75rem;
    font-style: italic;
    color: #94a3b8;
    margin-top: 2px;
  }
`;

export const AreaConfirmacaoEstorno = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-top: 1px solid #f1f5f9; 
  padding-top: 15px;
  margin-top: 4px;
  width: 100%;
`;

export const AcoesConfirmacao = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  @media (max-width: 767px) {
    flex-direction: column-reverse;
    gap: 10px;
  }
 
`;

export const BotaoConfirmacaoEstorno = styled(Button)`
  display: flex;
  align-items: center;
  gap: 4px;

  &:active {
    transform: scale(0.96);
  }

  /* 📱 Sobrescreve as regras do 'size=sm' quando a tela for de celular */
  @media (max-width: 767px) {
    width: 100% !important;
    min-height: 44px !important; /* Tamanho confortável de toque para o polegar */
    justify-content: center !important;
    padding: 14px 24px !important; /* Ganha o corpo robusto do botão de confirmar original */
    font-size: 0.9rem !important; /* Ajusta a fonte para o padrão mobile maior */
  }
`;

