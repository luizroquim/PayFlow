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