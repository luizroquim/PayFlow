import styled, { css } from "styled-components";

interface ButtonBaseProps {
  $variant: "primary" | "secondary" | "danger" | "confirm" | "ghost";
  $ativo?: boolean;
}

export const ButtonBase = styled.button<ButtonBaseProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.radii.default};
  font-weight: ${({ theme }) => theme.fonts.weights.bold};
  font-size: ${({ theme }) => theme.fonts.sizes.body};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  border: 1px solid transparent;

  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
    opacity: 0.7;
  }

  ${({ $variant, theme }) => {
    switch ($variant) {
      case "primary":
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
          }
        `;
      case "confirm":
        return css`
          background-color: ${theme.colors.success};
          color: ${theme.colors.white};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.successHover};
          }
        `;
      case "danger":
        return css`
          background-color: ${theme.colors.danger};
          color: ${theme.colors.secondary};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.dangerHover};
          }
        `;

      case "secondary":
      default:
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.textSecondary};
          border: 1px solid ${theme.colors.secondaryBorder};
          &:hover:not(:disabled) {
            color: black;
            border-color: #4d4c4c;
            background-color: white;
          }
        `;
    }
  }}
`;
