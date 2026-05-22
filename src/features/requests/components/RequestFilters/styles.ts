import styled from 'styled-components';

export const ContainerFiltros = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-bottom: 24px;
`;

export const LinhaPrincipal = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

export const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;

  .icon-search {
    position: absolute;
    left: 14px;
    color: #94a3b8;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  input {
    width: 100%;
    padding: 12px 16px 12px 46px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    background-color: #fff;
    font-size: 0.95rem;
    outline: none;
    color: #334155;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    &::placeholder {
      color: #94a3b8;
    }

    &:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.1);
    }
  }
`;

export const BotaoCalendario = styled.button<{ $ativo: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  height: 46px; /* Alinhado perfeitamente com a altura do input */
  background-color: ${props => props.$ativo ? '#0284c7' : '#fff'};
  color: ${props => props.$ativo ? '#fff' : '#0284c7'};
  border: 1px solid ${props => props.$ativo ? '#0284c7' : '#e2e8f0'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: all 0.15s ease-in-out;
  flex-shrink: 0;

  &:hover {
    background-color: ${props => props.$ativo ? '#0369a1' : '#f8fafc'};
    border-color: ${props => props.$ativo ? '#0369a1' : '#cbd5e1'};
  }

  @media (max-width: 480px) {
    padding: 0 14px;
    
    .texto-botao { 
      display: none; 
    } 
  }
`;

export const AreaDatas = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #f8fafc;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
 

  /* 📱 Se for tela de celular, os campos de data empilham na vertical automaticamente */
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .campo-data {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;

    label {
      font-size: 0.88rem;
      color: #64748b;
      font-weight: 600;
      min-width: 42px;
    }

    input {
      flex: 1;
      height: 38px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0 10px;
      font-size: 0.9rem;
      color: #334155;
      background-color: #ffffff;
      outline: none;
      font-family: inherit;

      &:focus {
        border-color: #0284c7;
      }
    }
  }

  .btn-limpar-data {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1px;
    background: transparent;
    border: none;
    
    background-color: #0284c7; 
    color: #ffffff;

        
    font-size: 0.88rem;
    cursor: pointer;
    font-weight: bold;
    padding: 6px 10px;
    border-radius: 6px;
    transition: background-color 0.15s;
    
    &:hover { 
      background-color: #0369a1;
      
    }

    @media (max-width: 600px) {
      margin-top: 4px;
      height: 38px;
      background-color: #0284c7; 
      

      &:hover{
        background-color: #0369a1; 
      }
      
    }
  }
`;