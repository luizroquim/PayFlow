import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const TituloModal = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #0f172a;
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
  min-height: 120px;
  max-height: 220px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1e293b;
  outline: none;
  resize: vertical;
  line-height: 1.5;
  transition: all 0.2s;

  &:focus {
    border-color: #0284c7;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.1);
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;

  @media (min-width: 480px) {
    flex-direction: row-reverse;

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

// --- COMPONENTES DO GERENCIADOR DE ANEXO ---

// Modo de Edição (Anexo vindo do banco de dados)
export const AnexoEditContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #fff;
`;

export const NomeArquivo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.95rem;
  color: #1e293b;
  overflow: hidden;
  max-width: 75%;
  cursor: pointer;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    color: #0284c7;
  
  }
`;

export const BtnTextoRemover = styled.button`
  background: none;
  border: none;
  color: #0284c7;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s;

  &:hover {
    color: #079cdc;
  }
`;

// Modo de Criação / Upload de Novo Arquivo
export const AnexoNovoContainer = styled.div`
  width: 100%;
  position: relative;
`;

export const TextoPlaceholder = styled.span`
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70%;
`;

export const NomeArquivoNovo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #1e293b;
  font-weight: 500;
  font-size: 0.95rem;
  overflow: hidden;
  max-width: 100%;
`;

export const TextoNomeFiltrado = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// 🎯 DECLARADO ANTES: Texto azul criado primeiro para o label conseguir referenciá-lo abaixo
export const BtnTextoAzulNativo = styled.span`
  color: #0284c7;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 8px;
  transition: all 0.2s ease-in-out;

  &:hover {
    color: #079cdc;
    
  }
`;

export const LabelAnexoCustomizado = styled.label`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  /* 🎯 HOVER EM SINCRONIA: Ativa o sublinhado do texto quando o mouse entra na caixinha */
  &:hover ${BtnTextoAzulNativo} {
    color: #079cdc;
    
  }

  /* 🎯 HOVER DA BORDA TOTAL: Destaca o contorno completo do botão e ativa um fundo sutil */
  &:hover {
    border-color: #0284c7;
    background-color: #f8fafc;
  }
`;

export const InputFileInvisivel = styled.input`
  display: none;
`;

export const BtnLimparArquivoNovo = styled.button`
  background: none;
  border: none;
  color: #0284c7;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.2s;

  &:hover {
    color: #079cdc;
   
  }
`;