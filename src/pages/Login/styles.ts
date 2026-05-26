// src/components/Login/styles.ts
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh; 
  width: 100%;
  background-color: #e9eff5; /* Fundo azulado bem claro da imagem */
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;

  /* 🎯 AJUSTE PARA MONITOR PORTÁTIL: Evita que o card corte no topo/base */
  padding: 20px 0; 
  overflow-y: auto; 
`;

export const LoginCard = styled.div`
  background-color: ${props => props.theme.colors.background};
  padding: 40px;
  border-radius: 24px; /* Bordas bem arredondadas */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;

  /* 🎯 AJUSTE PARA MONITOR PORTÁTIL: Centraliza dinamicamente sem quebrar */
  margin: auto; 

  h3 {
    margin-top: 0.9rem;
    font-size: 0.5rem;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    color: gray;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  margin-bottom: 15px;

  .logo-text {
    display: flex;
    font-size: 3rem;
  }

  .Pay {
    color: #074966;
  }

  .Flow {
    color: ${props => props.theme.colors.loginAction};
  }

  span {
    font-size: 0.6rem;
    color: #074966;
    text-align: center;
    line-height: 1.2;
  }

  img {
    width: 50px;
    height: 50px;
  }
`;

export const TabSelector = styled.div`
  display: flex;
  background-color: #e2e8f0;
  padding: 4px;
  border-radius: 100px;
  margin-bottom: 25px;
`;

export const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 100px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  background-color: ${props => props.active ? props.theme.colors.loginAction : "transparent"};
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.textSecondary};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  
  label {
    font-size: ${props => props.theme.fonts.sizes.label};
    font-weight: ${props => props.theme.fonts.weights.medium};
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: -10px;
  }

  /* 🎯 Mapeado direto do seu design system centralizado */
  button[type="submit"] {
    background-color: ${props => props.theme.colors.loginAction} !important;
    color: ${props => props.theme.colors.white} !important;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: ${props => props.theme.colors.loginActionHover} !important;
    }
  }
`;

export const Input = styled.input`
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  background-color: #f8fafc;
  font-size: 1rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
  }
`;

export const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.7rem;
  text-align: right;
  cursor: pointer;
  margin-top: -8px;
  margin-bottom: 8px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: color 0.2s;

  &:hover {
    color: ${props => props.theme.colors.loginAction};
  }
`;

export const ErrorMessage = styled.div`
  background-color: ${props => props.theme.colors.errorBackground};
  border: 1px solid ${props => props.theme.colors.errorBorder};
  color: ${props => props.theme.colors.errorText};
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 500;
  line-height: 1.4;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
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

export const SuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  background-color: ${props => props.theme.colors.successBackground};
  border: 1px solid ${props => props.theme.colors.successBorder};
  color: ${props => props.theme.colors.successText};
  margin: 20px 0;
  animation: scaleUp 0.3s ease-in-out;
  width: 100%;
  box-sizing: border-box;

  .icon-box {
    background-color: ${props => props.theme.colors.successIconBox};
    color: ${props => props.theme.colors.successIcon};
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 1.8rem;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #14532d;
  }

  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.successText};
    line-height: 1.4;
    margin: 0;
  }

  /* 🎯 Botão interno da caixa de sucesso consumindo as chaves corretas */
  button {
    background-color: ${props => props.theme.colors.loginAction} !important;
    color: ${props => props.theme.colors.white} !important;
    transition: background-color 0.2s ease-in-out;

    &:hover {
      background-color: ${props => props.theme.colors.loginActionHover} !important;
    }
  }

  @keyframes scaleUp {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const FieldError = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.theme.colors.fieldErrorText}; 
  font-size: 0.8rem;
  margin-top: -8px; 
  margin-bottom: 2px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  animation: fieldFadeIn 0.2s ease-in-out;

  svg {
    flex-shrink: 0;
  }

  @keyframes fieldFadeIn {
    from {
      opacity: 0;
      transform: translateY(-3px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;