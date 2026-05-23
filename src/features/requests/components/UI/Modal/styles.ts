import styled from "styled-components";

export const Overlay = styled.div`
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

export const Content = styled.div<{ $maxWidth: string }>`
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

  h3, h2, h4 {
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

  .finalizar-acoes-container {
    
    display: flex;
    justify-content:center;
    gap: 12px;
    width: 100%;
    margin-top: 20px;
  }
`;

export const ConfirmContent = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  animation: modalSwoosh 0.2s ease-out;

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
  }
`;