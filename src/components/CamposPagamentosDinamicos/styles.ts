import styled from "styled-components";

export const GrupoInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569; /* Mesma cor do label da NovaSolicitacao */
  }

  input, select {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #cbd5e1; /* Mesma borda padrão */
    font-size: 0.95rem;
    color: #1e293b; /* Mesma cor de texto */
    background-color: #fff;
    outline: none;
    transition: all 0.2s ease-in-out;
    font-family: inherit;

    &:focus {
      border-color: #0284c7; /* Mesmo azul de foco do sistema */
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.1);
    }

    &::placeholder {
      color: #94a3b8;
    }
  }

  select {
    cursor: pointer;
    appearance: none; /* Remove estilizações nativas bizarras de alguns navegadores */
    background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;
  }
`;

export const GridDuplo = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px; /* Alinhado com o gap padrão de 16px do formulário principal */

  @media (min-width: 480px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const BlocoDinamicoAnimado = styled.div`
  background-color: #ffffffa2; /* Um cinza bem sutil para destacar os campos extras */
  border-left: 4px solid #0284c7; /* Borda azul indicando a expansão */
  border-radius: 4px 8px 8px 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: swooshIn 0.2s ease-out;

  @media (min-width: 768px) {
    grid-column: span 2; /* Ocupa as duas colunas do Form principal para não quebrar o alinhamento */
  }

  @keyframes swooshIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const GridPix = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 480px) {
    grid-template-columns: 40% 60%;
  }
`;

export const GridTedLinhaUm = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 480px) {
    grid-template-columns: 2fr 1fr 2fr;
  }
`;

export const GridTedLinhaDois = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (min-width: 480px) {
    grid-template-columns: 40% 60%;
  }
`;