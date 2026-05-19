import styled from 'styled-components';

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #475569;
  }

  input {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    font-size: 0.95rem;
    color: #1e293b;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.1);
    }
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px; /* Altura confortável para digitar */
  max-height: 220px; /* Limita o crescimento para não quebrar a modal */
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  font-family: inherit; /* Mantém a mesma fonte do resto do sistema */
  color: #1e293b;
  outline: none;
  resize: vertical; /* Permite esticar apenas para baixo */
  line-height: 1.5;
  transition: all 0.2s;

  &:focus {
    border-color: #0284c7;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.1);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column; /* Empilha no mobile para facilitar o clique */
  gap: 10px;
  margin-top: 10px;

  @media (min-width: 480px) {
    flex-direction: row-reverse; /* No computador, bota o botão principal na direita */
    
    button {
      flex: 1;
    }
  }

  .btn-submit {
    background-color: #0284c7;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #079cdc;
    }

    &:disabled {
      background-color: #94a3b8;
      cursor: not-allowed;
    }
  }
`;