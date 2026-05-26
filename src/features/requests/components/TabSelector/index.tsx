// src/features/requests/components/TabSelector/index.tsx
import * as S from "./styles";

interface TabSelectorProps {
  abaAtiva: "pendente" | "comprado";
  onTrocaAba: (novaAba: "pendente" | "comprado") => void;
  totalPendentes: number;
  temNovaConcluida: boolean;
}

export function TabSelector({
  abaAtiva,
  onTrocaAba,
  totalPendentes,
  temNovaConcluida,
}: TabSelectorProps) {
  return (
    <S.TabContainer>
      <S.TabButton
        $isActive={abaAtiva === "pendente"}
        onClick={() => onTrocaAba("pendente")}
        $tabType="pendente"
      >
        Pendentes
        {totalPendentes > 0 && (
          <S.BadgeCount $isActive={abaAtiva === "pendente"}>
            {totalPendentes}
          </S.BadgeCount>
        )}
      </S.TabButton>

      <S.TabButton
        $isActive={abaAtiva === "comprado"}
        onClick={() => onTrocaAba("comprado")}
        $tabType="comprado"
      >
        Concluídas
        {temNovaConcluida && abaAtiva !== "comprado" && (
          <S.NewNotificationDot />
        )}
      </S.TabButton>
    </S.TabContainer>
  );
}
