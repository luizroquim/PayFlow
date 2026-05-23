import styled from "styled-components";
import { AlertCircle } from "lucide-react";

export const ErrorMessage = styled.span`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  margin-top: 6px;
`;

export const ErrorIcon = styled(AlertCircle)`
  flex-shrink: 0;
`;

export const FullWidthGridItem = styled.div`
  grid-column: 1 / -1;
`;

export const GridDuplo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
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