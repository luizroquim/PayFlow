import { forwardRef, type InputHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import * as S from "./styles";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, label, error, id, ...rest }, ref) => {
    const inputId = id ?? name;

    return (
      <S.Container>
        {label && <S.Label htmlFor={inputId}>{label}</S.Label>}
        
        <S.StyledInput
          id={inputId}
          name={name}
          ref={ref}
          {...rest}
        />
        
        {error && (
          <S.ErrorText>
            <AlertCircle size={14} />
            {error}
          </S.ErrorText>
        )}
      </S.Container>
    );
  }
);

Input.displayName = "Input";