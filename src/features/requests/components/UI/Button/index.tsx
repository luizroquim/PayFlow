import { type ButtonHTMLAttributes, memo } from "react";
import * as S from "./styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'confirm' | 'ghost';
  isLoading?: boolean;
}

export const Button = memo(function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  ...props 
}: ButtonProps) {
  return (
    <S.ButtonBase 
      $variant={variant} 
      disabled={isLoading || props.disabled} 
      {...props}
    >
      {isLoading ? "Processando..." : children}
    </S.ButtonBase>
  );
});