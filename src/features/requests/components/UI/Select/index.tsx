import { forwardRef, type SelectHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import * as S from "./styles";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  error?: string;
  children: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, label, error, id, children, ...rest }, ref) => {
    const selectId = id ?? name;

    return (
      <S.Container>
        {label && <S.Label htmlFor={selectId}>{label}</S.Label>}
        
        <S.StyledSelect
          id={selectId}
          name={name}
          ref={ref}
          {...rest}
        >
          {children}
        </S.StyledSelect>
        
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

Select.displayName = "Select";