import styled from "styled-components";

// 🎯 FORMULÁRIO PRINCIPAL: Grid responsivo sem travas para garantir fluidez
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  box-sizing: border-box;

  /* 🖥️ ALINHAMENTO DO GRID EM COMPUTADORES (Telas maiores) */
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr; /* Duas colunas idênticas lado a lado */
    column-gap: 32px; /* Espaço generoso entre as duas colunas */
    row-gap: 16px;
  }
`;

// 🎯 TÍTULO: Cruza o topo da modal de ponta a ponta no computador
export const TituloModal = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 4px;
  color: #0f172a;

  @media (min-width: 768px) {
    grid-column: span 2;
  }
`;

// 🎯 BLOCOS QUE FILTRAN A DISPOSIÇÃO LÓGICA DOS INPUTS
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

// 🎯 GRUPO DE INPUTS: Padronizado com focos suaves e transições limpas
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;

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
    box-sizing: border-box;

    &:focus {
      border-color: #0284c7;
      box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.1);
    }
  }
`;

// 🎯 TEXTAREA: Travada verticalmente para manter simetria entre as colunas
export const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  max-height: 120px;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  font-family: inherit;
  color: #1e293b;
  outline: none;
  resize: none;
  line-height: 1.5;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #0284c7;
    box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.1);
  }
`;

// 🎯 CONTAINER DE BOTÕES: Configurado com inversão mobile automatizada
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column-reverse; /* No celular, força o submit para cima e o fechar para baixo */
  gap: 10px;
  margin-top: 10px;
  width: 100%;

  button,
  a {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  /* 🖥️ ALINHAMENTO PARA COMPUTADORES (Telas maiores) */
  @media (min-width: 768px) {
    grid-column: span 2;
    flex-direction: row; /* Restaura lado a lado */
    justify-content: center; /* Centraliza no rodapé */
    width: 50%; /* Ocupa exatamente 50% da largura total */
    margin-left: auto; /* Centralização horizontal automática do bloco */
    margin-right: auto;
    gap: 16px;

    button,
    a {
      flex: 1; /* Divide o espaço igualmente entre os botões */
    }
  }

  .btn-submit {
    background-color: #0284c7;
    color: #fff;
    border: none;

    &:hover {
      background-color: #079cdc;
    }

    &:disabled {
      background-color: #94a3b8;
      cursor: not-allowed;
    }
  }

  /* Estilização base para o botão de "Voltar" */
  button:not(.btn-submit),
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fdfdfd;
    border: 1px solid #cbd5e1;
    color: #475569;
    text-decoration: none;

    &:hover {
      background-color: #f8fafc;
      color: #1e293b;
      border-color: #94a3b8;
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
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #fff;
  box-sizing: border-box;
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

export const ErrorHint = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0284c7;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 6px;
`;

export const IconInline = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

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
  box-sizing: border-box;

  &:hover ${BtnTextoAzulNativo} {
    color: #079cdc;
  }

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
