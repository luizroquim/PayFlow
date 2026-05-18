import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #e9eff5; /* Fundo azulado bem claro */
  font-family: 'Inter', sans-serif;
`;

export const LoginCard = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 24px; /* Bordas bem arredondadas */
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 400px;
  text-align: center;

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
  width: 100%;

  &:hover {
    background-color: #0582b7;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  color: #ef4444;
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
  padding: 24px 16px;
  background-color: #f0fdf4; /* Fundo verde bem suave */
  border: 1px solid #bbf7d0;
  border-radius: 16px;
  margin: 10px 0 20px;
  text-align: center;
  box-sizing: border-box;
  animation: scaleUp 0.3s ease-in-out;

  .icon-box {
    background-color: #22c55e;
    color: #ffffff;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
    font-size: 1.6rem;
  }

  h4 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #14532d;
  }

  p {
    font-size: 0.92rem;
    color: #475569;
    line-height: 1.5;
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