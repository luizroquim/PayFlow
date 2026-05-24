import type { ReactNode } from "react";
import * as S from "./styles";

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  maxWidth?: string;
  variant?: "default" | "confirm";
  fullScreenOnMobile?: boolean;
}

export function Modal({
  children,
  onClose,
  maxWidth = "950px",
  variant = "default",
  fullScreenOnMobile = false,
}: ModalProps) {
  // Função para fechar apenas se clicar no fundo escuro (Overlay)
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <S.Overlay
      onClick={handleOverlayClick}
      $fullScreenOnMobile={fullScreenOnMobile}
    >
      {variant === "confirm" ? (
        <S.ConfirmContent>{children}</S.ConfirmContent>
      ) : (
        <S.Content
          $maxWidth={maxWidth}
          $fullScreenOnMobile={fullScreenOnMobile}
        >
          {children}
        </S.Content>
      )}
    </S.Overlay>
  );
}
