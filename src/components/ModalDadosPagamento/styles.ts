import styled from "styled-components";

/* 🎯 NOVO CONTAINER SOBERANO QUE BLINDA O COMPONENTE INTERNO */
export const WrapperModalPagamento = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  .titulo-modal-pagamento {
    color: #0f172a !important; /* Força grafite escuro original */
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0 0 6px 0;
  }

  .descricao-modal-pagamento {
    color: #64748b !important; /* Força cinza slate original legível */
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0 0 16px 0;
  }
`;

export const ContainerDados = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: 10px;
`;

export const LinhaCopiavel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;

  label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .wrapper-input {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }

  input {
    width: 100%;
    padding: 10px 42px 10px 12px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background-color: #f8fafc;
    font-size: 0.95rem;
    color: #1e293b;
    font-weight: 500;
    outline: none;
    cursor: default;
  }

  .btn-copy {
    position: absolute;
    right: 8px;
    background: none;
    border: none;
    color: #0284c7;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      background-color: #e0f2fe;
      color: #079cdc;
    }

    &:active {
      transform: scale(0.95);
    }
  }
`;

export const GridPix = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  width: 100%;

  @media (min-width: 480px) {
    grid-template-columns: 35% 65%;
  }
`;

export const GridTedLinhaUm = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  width: 100%;

  @media (min-width: 480px) {
    grid-template-columns: 2fr 1fr 2fr;
  }
`;

export const AlertaCopiado = styled.span`
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 600;
  position: absolute;
  right: 44px;
  animation: fadeInOut 1.5s ease-in-out forwards;

  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(2px); }
    15% { opacity: 1; transform: translateY(0); }
    85% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-2px); }
  }
`;