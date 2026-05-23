import styled from "styled-components";

/* Container soberano que blinda o componente interno */
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
  min-width: 0;
`;

// 🎯 BLINDADO: Propriedade transiente $apenasLeitura evita qualquer warning no DOM
export const LinhaCopiavel = styled.div<{ $apenasLeitura?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;

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
    min-width: 0;
  }

  input {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    padding: ${(props) =>
      props.$apenasLeitura ? "10px 12px" : "10px 42px 10px 12px"};
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background-color: #f8fafc;
    font-size: 0.95rem;
    color: #1e293b;
    font-weight: 500;
    outline: none;
    cursor: ${(props) => (props.$apenasLeitura ? "default" : "pointer")};

    &:hover {
      border-color: ${(props) =>
        props.$apenasLeitura ? "#cbd5e1" : "#0284c7"};
    }
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
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

export const AlertaCopiado = styled.span`
  font-size: 0.75rem;
  color: #ffffff;
  background-color: #10b981;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;

  /* 🎯 POSICIONAMENTO: Balão flutuando logo acima do botão de cópia */
  position: absolute;
  top: -32px;
  right: 12px;
  z-index: 10;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    right: 12px;
    border-width: 4px 4px 0;
    border-style: solid;
    border-color: #10b981 transparent transparent;
  }

  animation: fadeInOut 1.5s ease-in-out forwards;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(4px);
    }
    15% {
      opacity: 1;
      transform: translateY(0);
    }
    85% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-4px);
    }
  }
`;
