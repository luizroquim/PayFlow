import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #e9eff5; // Fundo azulado bem claro da imagem
  font-family: 'Inter', sans-serif;

  /* 🎯 AJUSTE PARA MONITOR PORTÁTIL: Evita que o card corte no topo/base */
  padding: 40px 0; 
  overflow-y: auto; 
`;

export const LoginCard = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 24px; // Bordas bem arredondadas
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
    color: #079cdc;
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
  transition: all 0.2s;
  background-color: ${props => props.active ? "#079cdc" : "transparent"};
  color: ${props => props.active ? "white" : "#64748b"};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;

  label {
    font-size: 0.85rem;
    font-weight: 500;
    color: #475569;
    margin-bottom: -10px;
  }
`;

export const Input = styled.input`
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background-color: #f8fafc;
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: #007bff;
  }
`;

export const ActionButton = styled.button`
  background-color: #079cdc;
  color: white;
  padding: 12px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 4px;
  width: 100%; /* Garante preenchimento total do espaço disponível */

  &:hover {
    background-color: #0582b7;
  }
`;

/* 🎯 NOVO: Botão de "Esqueceu sua senha?" (Alinhado à direita e azul) */
export const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #475569;
  font-size: 0.7rem;
  text-align: right;
  cursor: pointer;
  margin-top: -8px;
  margin-bottom: 8px;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  transition: color 0.2s;

  &:hover {
    color: #079cdc;
  }
`;

/* 🎯 NOVO: Botão de "Voltar para o Login" (Centralizado e cinza com sublinhado) */
export const BackToLoginButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  font-size: 0.85rem;
  cursor: pointer;
  margin-top: 10px;
  font-weight: 500;
  
  font-family: 'Inter', sans-serif;
  text-align: center;
  transition: color 0.2s;

  &:hover {
    color: #079cdc;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fef2f2; /* Fundo vermelho bem suave */
  border: 1px solid #fee2e2;
  color: #ef4444; /* Texto vermelho de atenção */
  padding: 12px 16px;
  border-radius: 10px; /* Alinhado com o border-radius dos seus inputs */
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
  background-color: #f0fdf4; /* Fundo verde bem suave */
  border: 1px solid #bbf7d0;
  border-radius: 16px;
  color: #166534;
  margin: 20px 0;
  animation: scaleUp 0.3s ease-in-out;
  width: 100%;
  box-sizing: border-box;

  .icon-box {
    background-color: #dcfce7;
    color: #15803d;
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
    color: #166534;
    line-height: 1.4;
    margin: 0;
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