import styled from "styled-components";

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;

  label {
    font-size: ${({ theme }) => theme.fonts.sizes.label};
    font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const AnexoEditContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  box-sizing: border-box;
`;

export const NomeArquivo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.fonts.sizes.body};
  color: ${({ theme }) => theme.colors.textMain};
  overflow: hidden;
  max-width: 75%;
  cursor: pointer;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const BtnTextoRemover = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fonts.sizes.label};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  cursor: pointer;
  padding: 4px 8px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const AnexoNovoContainer = styled.div`
  width: 100%;
  position: relative;
`;

export const LabelAnexoCustomizado = styled.label`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.smooth};
  box-sizing: border-box;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

export const TextoPlaceholder = styled.span`
  color: ${({ theme }) => theme.colors.textMain};
  font-size: ${({ theme }) => theme.fonts.sizes.body};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
`;

export const NomeArquivoNovo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.textMain};
  font-weight: ${({ theme }) => theme.fonts.weights.medium};
  font-size: ${({ theme }) => theme.fonts.sizes.body};
  overflow: hidden;
  max-width: 100%;
`;

export const TextoNomeFiltrado = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const IconInline = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const BtnTextoAzulNativo = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fonts.sizes.label};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  padding: 4px 8px;
  transition: ${({ theme }) => theme.transitions.smooth};

  ${LabelAnexoCustomizado}:hover & {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const BtnLimparArquivoNovo = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fonts.sizes.label};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  cursor: pointer;
  padding: 4px 8px;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const InputFileInvisivel = styled.input`
  display: none;
`;