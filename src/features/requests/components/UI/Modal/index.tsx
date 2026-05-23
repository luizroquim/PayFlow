import type { ReactNode } from "react";
import * as S from "./styles";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  maxWidth?: string;
  variant?: "default" | "confirm";
}

export function Modal({ 
  children, 
  onClose, 
  maxWidth = "950px", 
  variant = "default" 
}: ModalProps) {
  
  // Função para fechar apenas se clicar no fundo escuro (Overlay)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <S.Overlay onClick={handleOverlayClick}>
      {variant === "confirm" ? (
        <S.ConfirmContent>{children}</S.ConfirmContent>
      ) : (
        <S.Content $maxWidth={maxWidth}>{children}</S.Content>
      )}
    </S.Overlay>
  );
}