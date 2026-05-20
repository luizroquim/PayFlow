import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import * as S from "./styles";

interface FiltrosProps {
  valor: string;
  setValor: (valor: string) => void;
  placeholder?: string;
  dataInicio: string;
  setDataInicio: (data: string) => void;
  dataFim: string;
  setDataFim: (data: string) => void;
}

export function Filtros({
  valor,
  setValor,
  placeholder,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
}: FiltrosProps) {
  // Estado para controlar se a gaveta de datas está aberta ou fechada
  const [mostrarDatas, setMostrarDatas] = useState(false);

  const limparFiltrosData = () => {
    setDataInicio("");
    setDataFim("");
  };

  const temDataAtiva = !!(dataInicio || dataFim);

  return (
    <S.ContainerFiltros>
      {/* Linha de cima: Input de busca + Botão de abrir calendário */}
      <S.LinhaPrincipal>
        <S.InputWrapper>
          <div className="icon-search">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder={
              placeholder || "Pesquisar por título ou solicitante..."
            }
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
        </S.InputWrapper>

        <S.BotaoCalendario
          type="button"
          onClick={() => setMostrarDatas(!mostrarDatas)}
          ativo={temDataAtiva}
          title="Filtrar por data de criação"
        >
          <Calendar size={18} />
        </S.BotaoCalendario>
      </S.LinhaPrincipal>

      {/* Linha de baixo expandida: Inputs de Data Inicial e Final */}
      {mostrarDatas && (
        <S.AreaDatas>
          <div className="campo-data">
            <label>Início:</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              max={dataFim || undefined}
            />
          </div>

          <div className="campo-data">
            <label>Fim:</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              min={dataInicio || undefined}
            />
          </div>

          {temDataAtiva && (
            <button
              className="btn-limpar-data"
              onClick={limparFiltrosData}
              type="button"
            >
              Limpar
            </button>
          )}
        </S.AreaDatas>
      )}
    </S.ContainerFiltros>
  );
}
