import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 32px;
    row-gap: 16px;
  }
`;

export const TituloModal = styled.h2`
  font-size: ${({ theme }) => theme.fonts.sizes.title};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  margin-bottom: 4px;
  color: ${({ theme }) => theme.colors.textTitle};

  @media (min-width: 768px) {
    grid-column: span 2;
  }
`;

export const ColunaEsquerda = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const ColunaDireita = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

// 🎯 GRUPO DE INPUTS E TEXTAREA LOCAIS
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

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  max-height: 120px;
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fonts.sizes.body};
  font-family: inherit;
  color: ${({ theme }) => theme.colors.textMain};
  outline: none;
  resize: none;
  line-height: 1.5;
  transition: ${({ theme }) => theme.transitions.fast};
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.background};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryFocusShadow};
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 10px;
  margin-top: 10px;
  width: 100%;

  button,
  a {
    width: 100%;
    padding: 12px;
    border-radius: ${({ theme }) => theme.radii.default};
    font-weight: ${({ theme }) => theme.fonts.weights.bold};
    font-size: ${({ theme }) => theme.fonts.sizes.body};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.fast};
    box-sizing: border-box;
  }

  @media (min-width: 768px) {
    grid-column: span 2;
    flex-direction: row;
    justify-content: center;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    gap: 16px;

    button,
    a {
      flex: 1;
    }
  }

  .btn-submit {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border: none;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primaryHover};
    }

    &:disabled {
      background-color: ${({ theme }) => theme.colors.disabled};
      cursor: not-allowed;
    }
  }

  button:not(.btn-submit),
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.colors.backgroundLight};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textSecondary};
    text-decoration: none;

    &:hover {
      background-color: ${({ theme }) => theme.colors.backgroundHover};
      color: ${({ theme }) => theme.colors.textMain};
      border-color: ${({ theme }) => theme.colors.disabled};
    }
  }
`;

// --- COMPONENTES DO GERENCIADOR DE ANEXO ---

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

export const ErrorHint = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.primary}; /* Ou colors.danger quando criarmos */
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  margin-top: 6px;
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

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
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

  &:hover ${BtnTextoAzulNativo} {
    color: ${({ theme }) => theme.colors.primaryHover};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.backgroundHover};
  }
`;

export const InputFileInvisivel = styled.input`
  display: none;
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

export const BlocoDinamicoAnimado = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
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