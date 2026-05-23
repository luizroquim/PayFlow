import styled from "styled-components";

export const ConfirmModalContent = styled.div`
  background: #ffffff;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalSwoosh 0.2s ease-out;

  h3 {
    font-size: 1.2rem;
    color: #0f172a !important;
    margin: 0 0 8px 0;
    font-weight: 700;
  }

  p {
    font-size: 0.95rem;
    color: #64748b !important;
    margin: 0 0 24px 0;
    line-height: 1.5;
  }

  .actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    width: 100%;
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
`;