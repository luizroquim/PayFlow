import styled from "styled-components";

export const WrapperModalFinalizar = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 450px; /* 🎯 FIXADO: Tamanho ideal compacto para o upload */
  margin: auto;      /* 🎯 CENTRALIZADO: Encaixa perfeitamente no meio da tela */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSwoosh 0.2s ease-out;

  .titulo-finalizar {
    color: #0f172a !important;
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 4px 0;
  }

  .descricao-finalizar {
    font-size: 0.9rem;
    color: #64748b !important;
    margin: 0 0 10px 0;
    line-height: 1.5;
    text-align: left;
  }

  .container-upload-file {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 16px 0;
  }

  .finalizar-acoes-container {
    display: flex;
    gap: 12px;
    width: 100%;
    margin-top: 20px;

    button {
      flex: 1; 
      padding: 12px;
      border: none;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
      font-size: 0.9rem;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }

    .btn-confirmar-final {
      background-color: #10b981;
      color: #fff;

      &:disabled {
        background-color: #a7f3d0;
        color: #065f46;
        cursor: not-allowed;
        opacity: 0.7;
      }
    }

    .btn-cancelar-final {
      background-color: #fdfdfd;
      color: #4d4c4c;
      border: 1px solid #c5c5c5;

      &:hover {
        color: black;
        border: #4d4c4c 1px solid;
        background-color: white;
      }
    }
  }

  /* 🎯 ANIMAÇÃO PARA FICAR IDENTICA AS OUTRAS Modais */
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

export const AnexoNovoContainer = styled.div`
  width: 100%;
  position: relative;
`;

export const TextoPlaceholder = styled.span`
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
`;

export const NomeArquivoNovo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1e293b;
  font-weight: 500;
  font-size: 0.95rem;
  overflow: hidden;
  max-width: 100%;
`;

export const TextoNomeFiltrado = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BtnTextoAzulNativo = styled.span`
  color: #0284c7;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 8px;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #079cdc;
  }
`;

export const LabelAnexoCustomizado = styled.label`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover ${BtnTextoAzulNativo} {
    color: #079cdc;
  }

  &:hover {
    border-color: #0284c7;
  }
`;

export const InputFileInvisivel = styled.input`
  display: none;
`;

export const BtnLimparArquivoNovo = styled.button`
  background: none;
  border: none;
  color: #0284c7;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s;

  &:hover {
    color: #079cdc;
  }
`;