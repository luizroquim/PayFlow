import styled from 'styled-components';

export const Container = styled.div`
  background-color: #e9eff5;
  min-height: 100vh;
  color: #d4e0f3;
  display: flex;
  flex-direction: column;
`;

// --- HEADER RESPONSIVO ---
export const Header = styled.header`
  background-color: #ffffff;
  padding: 15px 20px;
  display: flex;
  flex-direction: column; /* Empilha no mobile por padrão */
  gap: 10px;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);

  @media (min-width: 768px) {
    flex-direction: row; /* Alinha lado a lado no Tablet/PC */
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

      img{
        width:2rem;
        height:2rem;

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
    gap: 15px;
    width: 100%;
    justify-content: space-between;

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

      @media (min-width: 480px) {
        max-width: none;
      }
    }

    .btn-new-request {
      display:flex;
      align-items:center;
      gap:4px;
      background-color: #0284c7;
      color: #fff;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 0.8rem;
      cursor: pointer;
      transition: background-color 0.2s;

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

      &:hover {
        transform: scale(1.1);
        color:#079cdc;
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

export const TabButton = styled.button<{ isActive: boolean; tabType: 'pendente' | 'comprado' }>`
  flex: 1;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
  background-color: ${props => props.isActive ? "#ffffff" : "transparent"};
  box-shadow: ${props => props.isActive ? "0 2px 4px rgba(0, 0, 0, 0.05)" : "none"};
  
  color: ${props => {
    if (!props.isActive) return "#64748b";
    return props.tabType === 'pendente' ? "#0284c7" : "#10b981";
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

// --- MODAIS ---
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
`;

export const ModalContent = styled.div<{ maxWidth: string }>`
  display:flex;
  flex-direction:column;
  gap:1px;
  width: 100%;
  max-width: ${props => props.maxWidth};
  background-color: #fff;
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
  animation: modalSwoosh 0.2s ease-out;

  @keyframes modalSwoosh {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  h3 {
    margin-bottom:10px;
    color: #0f172a;
    font-size: 1.25rem;
  }

  .modal-description {
    font-size: 0.9rem;
    color: #64748b;
    margin-bottom: 20px;
  }

  .file-input {
    margin-bottom: 25px;
    width: 100%;
    font-size: 0.9rem;
    color:black;
  }

  .modal-actions {
    display: flex;
    gap: 12px;

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

    .btn-submit-payment {
      background-color: #10b981;
      color: #fff;
      &:disabled { background-color: #94a3b8; }
    }

    .btn-cancel-payment {
      background-color: #f1f5f9;
      color: #64748b;
    }
  }

  .btn-close-modal {
    width: 100%;
    margin-top: 15px;
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 500;
    
    &:hover {
      color: #64748b;
    }
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
`;

// --- LINKS DE PAGINAÇÃO RESPONSIVA ---
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 30px;
  width: 100%;
  flex-wrap: wrap; /* Permite que os botões quebrem de linha se a tela for muito pequena */
`;

export const PaginationButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.isActive ? "#0284c7" : "#cbd5e1"};
  background-color: ${props => props.isActive ? "#0284c7" : "#ffffff"};
  color: ${props => props.isActive ? "#ffffff" : "#64748b"};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: ${props => props.isActive ? "#079cdc" : "#f8fafc"};
    border-color: ${props => props.isActive ? "#079cdc" : "#94a3b8"};
    color: ${props => props.isActive ? "#ffffff" : "#334155"};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f1f5f9;
    border-color: #e2e8f0;
  }

  /* No mobile, aumenta um pouco o espaçamento do botão para facilitar o clique com o dedão */
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
      background-color: #f1f5f9;
      color: #475569;

      &:hover {
        background-color: #e2e8f0;
      }
    }

    .btn-delete {
      background-color: #ef4444; /* Vermelho do Tailwind */
      color: #ffffff;

      &:hover {
        background-color: #dc2626;
      }
    }
  }
`;