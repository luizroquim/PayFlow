import styled from "styled-components";
import { AlertCircle } from "lucide-react";

export const ErrorMessage = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  color: #0284c7;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 6px;
`;

export const ErrorIcon = styled(AlertCircle)`
  flex-shrink: 0;
`;

export const FullWidthGridItem = styled.div`
  grid-column: 1 / -1;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
  }

  input,
  select {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 0.95rem;
    color: #1e293b;
    background-color: #fff;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;

    &:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.1);
    }
  }
`;

export const GridDuplo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
`;

export const BlocoDinamicoAnimado = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-top: 16px;
  animation: fadeIn 0.2s ease-in-out;

  @keyframes fadeIn {
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
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
`;

export const GridTedLinhaUm = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  gap: 16px;
  width: 100%;
`;

export const GridTedLinhaDois = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
`;
