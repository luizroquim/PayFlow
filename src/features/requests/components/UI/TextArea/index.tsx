import { forwardRef, type TextareaHTMLAttributes } from "react";
import { AlertCircle } from "lucide-react";
import * as S from "./styles";

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  error?: string;
  
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, label, error, id, ...rest }, ref) => {
    const areaId = id ?? name;

    return (
      <S.Container>
        {label && <S.Label htmlFor={areaId}>{label}</S.Label>}
        
        <S.StyledTextArea
          id={areaId}
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

TextArea.displayName = "TextArea";