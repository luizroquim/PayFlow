import styled from "styled-components";

export const WrapperModalFinalizar = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  margin: auto;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
`;
