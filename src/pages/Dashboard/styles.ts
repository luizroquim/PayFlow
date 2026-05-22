import styled from "styled-components";

export const Container = styled.div`
  background-color: #e9eff5;
  min-height: 100vh;
  color: #d4e0f3;
  display: flex;
  flex-direction: column;
`;

// --- HEADER RESPONSIVO COM INVERSÃO NO MOBILE ---
export const Header = styled.header`
  background-color: #ffffff;
  padding: 15px 20px;
  display: flex;
  flex-direction: column; /* Empilha a logo e os controles no mobile */
  gap: 16px;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);

  @media (min-width: 768px) {
    flex-direction: row; /* Alinha logo e controles lado a lado no PC */
    justify-content: space-between;
    padding: 15px 40px;
  }

  .brand-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;

    .logo-box {
      background-color: #ffffff;
      color: #fff;
      padding: 1px;
      border-radius: 8px;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 2rem;
        height: 2rem;
      }
    }

    h2 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: #676989;
    }
  }

  .user-controls {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    justify-content: space-between; /* Garante o espaçamento total entre as pontas no mobile */

    @media (min-width: 768px) {
      width: auto;
      gap: 20px;
    }

    .user-email {
      font-size: 0.85rem;
      color: #64748b;
      max-width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      /* 📱 No Mobile: assume a segunda posição na ordem (fica entre o botão de criar e o de sair) */
      @media (max-width: 600px) {
        order: 2;
        max-width: 110px; /* Evita que e-mails muito longos empurrem o botão de sair */
        text-align: right;
        margin-left: auto; /* Empurra ele e o botão de sair o máximo possível para a direita */
      }

      @media (min-width: 480px) {
        max-width: none;
      }
    }

    .btn-new-request {
      display: flex;
      align-items: center;
      gap: 4px;
      background-color: #0284c7;
      color: #fff;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background-color 0.2s;

      /* 📱 No Mobile: assume a primeira posição na ordem (vai direto para a extrema esquerda) */
      @media (max-width: 600px) {
        order: 1;
        padding: 10px 12px; /* Ligeiramente mais compacto para caber perfeitamente */
      }

      &:hover {
        background-color: #079cdc;
      }
    }

    .btn-logout {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      transition: transform 0.2s;

      /* 📱 No Mobile: assume a terceira posição (extrema direita, colado no e-mail) */
      @media (max-width: 600px) {
        order: 3;
      }

      &:hover {
        transform: scale(1.1);
        color: #079cdc;
      }
    }
  }
`;

export const MainContent = styled.main`
  width: 100%;
  max-width: 1040px;
  margin: 0 auto;
  padding: 20px;

  @media (min-width: 768px) {
    padding: 40px 20px;
  }
`;

// --- SELETOR DE ABAS ---
export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 25px;
  background-color: #f1f5f9;
  padding: 5px;
  border-radius: 12px;
  width: 100%;

  @media (min-width: 480px) {
    width: fit-content;
  }
`;

interface TabButtonProps {
  $isActive: boolean;
  $tabType: "pendente" | "comprado";
}

export const TabButton = styled.button<TabButtonProps>`
  flex: 1;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  background-color: ${(props) => (props.$isActive ? "#ffffff" : "transparent")};
  box-shadow: ${(props) =>
    props.$isActive ? "0 2px 4px rgba(0, 0, 0, 0.05)" : "none"};

  color: ${(props) => {
    if (!props.$isActive) return "#64748b";
    return props.$tabType === "pendente" ? "#0284c7" : "#10b981";
  }};

  @media (min-width: 480px) {
    flex: none;
    padding: 10px 25px;
  }
`;

export const CardsStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// --- MODAIS COM ROLAGEM NATURAL NO CELULAR ---
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;

  @media (max-width: 768px) {
    align-items: flex-start;
    overflow-y: auto;
    padding: 16px 12px;
    -webkit-overflow-scrolling: touch;
  }
`;

// 🎯 CORRIGIDO: Utilizando propriedade transiente ($maxWidth) para limpar de vez o DOM
export const ModalContent = styled.div<{ $maxWidth: string }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  max-width: ${(props) => props.$maxWidth};
  background-color: #fff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalSwoosh 0.2s ease-out;
  box-sizing: border-box;

  color: #1e293b;

  @media (max-width: 768px) {
    margin-top: 10px;
    margin-bottom: 30px;
    padding: 20px 16px;
  }

  @keyframes modalSwoosh {
    from {
      transform: scale(0.95);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  h3,
  h2,
  h4 {
    margin: 0 0 4px 0;
    color: #0f172a !important;
    font-size: 1.25rem;
    font-weight: 700;
  }

  .modal-description {
    font-size: 0.9rem;
    color: #64748b !important;
    margin: 0 0 10px 0;
    line-height: 1.5;
  }

  .file-input {
    margin-bottom: 25px;
    width: 100%;
    font-size: 0.9rem;
    color: black;
  }

  .finalizar-acoes-container {
    display: flex;
    gap: 12px;
    width: 100%;
    margin-top: 20px;

    button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 10px;
      font-weight: bold;
      cursor: pointer;
      font-size: 0.9rem;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }

    .btn-confirmar-final {
      background-color: #10b981;
      color: #fff;

      &:disabled {
        background-color: #a7f3d0;
        color: #065f46;
        cursor: not-allowed;
        opacity: 0.7;
      }
    }

    .btn-cancelar-final {
      background-color: #fdfdfd;
      color: #4d4c4c;
      border: 1px solid #c5c5c5;

      &:hover {
        color: black;
        border: #4d4c4c 1px solid;
        background-color: white;
      }
    }
  }

  .btn-close-modal {
    width: 100%;
    margin-top: 15px;
    background-color: #fdfdfd;
    border: 1px solid #c5c5c5;
    color: #4d4c4c;
    padding: 13px;
    border-radius: 8px;
    font-weight: bold;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      color: black;
      border: #4d4c4c 1px solid;
      background-color: white;
    }

    @media (min-width: 768px) {
      width: 50%;
      margin-left: auto;
      margin-right: auto;
      display: block;
    }
  }
`;

// --- COMPONENTES DO GERENCIADOR DE ANEXO DA DASHBOARD ---
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

  &:hover ${BtnTextoAzulNativo} {
    color: #079cdc;
  }

  &:hover {
    border-color: #0284c7;
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

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #64748b;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  font-size: 0.95rem;

  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// --- LINKS DE PAGINAÇÃO RESPONSIVA ---
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  width: 100%;
  flex-wrap: wrap;
`;

export const PaginationButton = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.$isActive ? "#0284c7" : "#cbd5e1")};
  background-color: ${(props) => (props.$isActive ? "#0284c7" : "#ffffff")};
  color: ${(props) => (props.$isActive ? "#ffffff" : "#64748b")};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$isActive ? "#0284c7" : "#f8fafc")};
    border-color: ${(props) => (props.$isActive ? "#0284c7" : "#94a3b8")};
    color: ${(props) => (props.$isActive ? "#ffffff" : "#334155")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
    border-color: #e2e8f0;
  }

  @media (max-width: 480px) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
`;

// --- MODAL DE CONFIRMAÇÃO DE EXCLUSÃO ---
export const ConfirmModalContent = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);

  h3 {
    font-size: 1.2rem;
    color: #0f172a;
    margin-bottom: 8px;
    font-weight: 700;
  }

  p {
    font-size: 0.95rem;
    color: #64748b;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 12px;

    button {
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-cancel {
      background-color: #fdfdfd;
      color: #4d4c4c;
      border: 1px solid #c5c5c5;

      &:hover {
        color: black;
        border: #4d4c4c 1px solid;
        background-color: white;
      }
    }

    .btn-delete {
      background-color: #ef4444;
      color: #ffffff;

      &:hover {
        background-color: #dc2626;
      }
    }
  }
`;
