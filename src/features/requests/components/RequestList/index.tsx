import { memo } from "react"; // 🎯 Removeu o useEffect e useRef daqui
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RequestCard } from "../RequestCard";
import type { Solicitacao } from "../../../../pages/Dashboard";
import * as S from "./styles";

interface RequestListProps {
  cardsDaPaginaAtual: Solicitacao[];
  currentUserId: string | null;
  isPagador: boolean;
  totalPaginas: number;
  paginaSegura: number;
  setPaginaAtual: React.Dispatch<React.SetStateAction<number>>;
  onEdit: (item: Solicitacao) => void;
  onDelete: (id: string) => void;
  onPay: (item: Solicitacao) => void;
}

export const RequestList = memo(function RequestList({
  cardsDaPaginaAtual,
  currentUserId,
  isPagador,
  totalPaginas,
  paginaSegura,
  setPaginaAtual,
  onEdit,
  onDelete,
  onPay,
}: RequestListProps) {
  return (
    <>
      <S.CardsStack>
        {cardsDaPaginaAtual.map((item) => (
          <RequestCard
            key={item.id}
            item={item}
            currentUserId={currentUserId}
            isPagador={isPagador}
            onEdit={onEdit}
            onDelete={onDelete}
            onPay={onPay}
          />
        ))}
      </S.CardsStack>

      {totalPaginas > 1 && (
        <S.PaginationContainer>
          <S.PaginationButton
            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaSegura === 1}
          >
            <ChevronLeft size={16} /> <span>Anterior</span>
          </S.PaginationButton>

          {Array.from({ length: totalPaginas }, (_, index) => (
            <S.PaginationButton
              key={index + 1}
              $isActive={paginaSegura === index + 1}
              onClick={() => setPaginaAtual(index + 1)}
            >
              {index + 1}
            </S.PaginationButton>
          ))}

          <S.PaginationButton
            onClick={() =>
              setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaSegura === totalPaginas}
          >
           <span> Próximo</span> <ChevronRight size={16} />
          </S.PaginationButton>
        </S.PaginationContainer>
      )}
    </>
  );
});
