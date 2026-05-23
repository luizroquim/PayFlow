import styled from "styled-components";

export const Header = styled.header`
  background-color: #ffffff;
  padding: 15px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);

  @media (min-width: 768px) {
    flex-direction: row;
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

      @media (max-width: 600px) {
        order: 2;
        max-width: 110px;
        text-align: right;
        margin-left: auto;
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

      @media (max-width: 600px) {
        order: 1;
        padding: 10px 12px;
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