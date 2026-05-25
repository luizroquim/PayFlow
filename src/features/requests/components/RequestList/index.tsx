import { memo } from "react";
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
  // 🛠️ Função inteligente para calcular o miolo das páginas visíveis
  const obterPaginasVisiveis = () => {
    const maxAba = 3; // Define o limite de botões numéricos visíveis por vez
    let paginaInicial = Math.max(1, paginaSegura - Math.floor(maxAba / 2));
    let paginaFinal = paginaInicial + maxAba - 1;

    if (paginaFinal > totalPaginas) {
      paginaFinal = totalPaginas;
      paginaInicial = Math.max(1, paginaFinal - maxAba + 1);
    }

    const paginas = [];
    for (let i = paginaInicial; i <= paginaFinal; i++) {
      paginas.push(i);
    }
    return { paginas, paginaInicial, paginaFinal };
  };

  const { paginas, paginaInicial, paginaFinal } = obterPaginasVisiveis();

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
          {/* Botão Anterior */}
          <S.PaginationButton
            onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaSegura === 1}
          >
            <ChevronLeft size={16} /> <span>Anterior</span>
          </S.PaginationButton>

          {/* Reticências Iniciais se não estiver na primeira página */}
          {paginaInicial > 1 && (
            <S.PaginationButton onClick={() => setPaginaAtual(1)}>
              1{paginaInicial > 2 && " ..."}
            </S.PaginationButton>
          )}

          {/* Renderização das páginas limitadas */}
          {paginas.map((num) => (
            <S.PaginationButton
              key={num}
              $isActive={paginaSegura === num}
              onClick={() => setPaginaAtual(num)}
            >
              {num}
            </S.PaginationButton>
          ))}

          {/* Reticências Finais se não estiver na última página */}
          {paginaFinal < totalPaginas && (
            <S.PaginationButton onClick={() => setPaginaAtual(totalPaginas)}>
              {paginaFinal < totalPaginas - 1 && "... "}
              {totalPaginas}
            </S.PaginationButton>
          )}

          {/* Botão Próximo */}
          <S.PaginationButton
            onClick={() =>
              setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaSegura === totalPaginas}
          >
            <span>Próximo</span> <ChevronRight size={16} />
          </S.PaginationButton>
        </S.PaginationContainer>
      )}
    </>
  );
});
