import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
`;

export const Label = styled.label`
  font-size: ${({ theme }) => theme.fonts.sizes.label};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.radii.default};
  font-size: ${({ theme }) => theme.fonts.sizes.body};
  color: ${({ theme }) => theme.colors.textMain};
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  outline: none;
  box-sizing: border-box;
  transition: ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primaryFocusShadow};
  }
`;

export const ErrorText = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fonts.sizes.small};
  font-weight: ${({ theme }) => theme.fonts.weights.semiBold};
  margin-top: 2px;
`;