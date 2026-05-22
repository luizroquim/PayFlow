import styled from "styled-components";

// 🎯 OTIMIZADO: Removido o generic antigo para evitar vazamento no DOM. Ele lê via classe CSS
export const CardContainer = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 15px;

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

    a, button {
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
      gap: 10px;
      width: 100%;

      @media (min-width: 480px) {
        width: auto;
      }

      button {
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 0.85rem;
        cursor: pointer;
        font-weight: 500;
        transition: all 0.2s;
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
      width: 100%;
      background-color: #1aac7c;
      color: #fff;
      border: none;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.2s;

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
  width: 100%;
  max-width: ${(props) => props.$maxWidth};
  background-color: #fff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-top: 10px;
    margin-bottom: 30px;
    padding: 20px 16px;
  }
`;

export const ButtonFecharDados = styled.button`
  width: 100%;
  margin-top: 15px;
  background-color: #fdfdfd;
  border: 1px solid #c5c5c5;
  color: #4d4c4c;
  padding: 13px;
  border-radius: 8px;
  font-weight: bold;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: black;
    border: #4d4c4c 1px solid;
    background-color: white;
  }

  @media (min-width: 768px) {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    font-size: 0.9rem;
  }
`;