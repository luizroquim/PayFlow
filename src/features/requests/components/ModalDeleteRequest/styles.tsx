import styled from "styled-components";

export const ConfirmModalContent = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px; /* 🎯 FIXADO: Limita o tamanho máximo para não esticar na tela toda */
  margin: auto; /* 🎯 CENTRALIZADO: Encaixa perfeitamente no meio do overlay escuro */
  display: flex;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSwoosh 0.2s ease-out; /* 🎯 ANIMAÇÃO: Adiciona o efeito suave ao abrir */

  h3 {
    font-size: 1.2rem;
    color: #0f172a !important;
    margin: 0 0 8px 0;
    font-weight: 700;
  }

  p {
    font-size: 0.95rem;
    color: #64748b !important;
    margin: 0 0 24px 0;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    width: 100%;

    button {
      flex: 1;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    .btn-cancel {
      background-color: #fdfdfd;
      color: #4d4c4c;
      border: 1px solid #c5c5c5;

      &:hover:not(:disabled) {
        color: black;
        border: #4d4c4c 1px solid;
        background-color: white;
      }
    }

    .btn-delete {
      background-color: #ef4444;
      color: #ffffff;

      &:hover:not(:disabled) {
        background-color: #dc2626;
      }
    }
  }

  /* 🎯 ANIMAÇÃO DE ENTRADA DA MODAL */
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
`;
