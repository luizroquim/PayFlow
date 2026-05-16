import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e9eff5; // Fundo azulado bem claro da imagem
  font-family: 'Inter', sans-serif;
`;

export const LoginCard = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 24px; // Bordas bem arredondadas
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;

  h3{
    margin-top:0.9rem;
    font-size:0.5rem;
    font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    color:gray;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
  margin-bottom: 15px;
  



  .logo-text{
    display:flex;
    font-size:3rem

  }

  .Pay{
    color:#074966;
    

  }

  .Flow{
    color:#079cdc;
    
  }




  span {
    font-size: 0.6rem;
    color: #074966;
    text-align: center;
    line-height: 1.2;
  }

  img{
    width:50px;
    height:50px;
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

  &:hover {
    background-color: #0582b7;
  }
`;





