import { type ButtonHTMLAttributes, memo } from "react";
import * as S from "./styles";



interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'confirm' | 'ghost';
  isLoading?: boolean;
  size?: 'sm' | 'md';
}

export const Button = memo(function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  size = 'md',
  ...props 
}: ButtonProps) {
  return (
    <S.ButtonBase 
      $variant={variant} 
      $size={size}
      disabled={isLoading || props.disabled} 
      {...props}
    >
      {isLoading ? "Processando..." : children}
    </S.ButtonBase>
  );
});