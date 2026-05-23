import { useState, memo } from "react";
import { Search, Calendar } from "lucide-react";
import * as S from "./styles";
import { Button } from "../../components/UI/index";

interface RequestFiltersProps {
  valor: string;
  setValor: (valor: string) => void;
  placeholder?: string;
  dataInicio: string;
  setDataInicio: (data: string) => void;
  dataFim: string;
  setDataFim: (data: string) => void;
}

function RequestFiltersComponent({
  valor,
  setValor,
  placeholder,
  dataInicio,
  setDataInicio,
  dataFim,
  setDataFim,
}: RequestFiltersProps) {
  const [mostrarDatas, setMostrarDatas] = useState(false);

  const limparFiltrosData = () => {
    setDataInicio("");
    setDataFim("");
  };

  const temDataAtiva = !!(dataInicio || dataFim);

  const handleDataInicioChange = (novaData: string) => {
    if (dataFim && novaData > dataFim) {
      setDataInicio(dataFim);
    } else {
      setDataInicio(novaData);
    }
  };

  const handleDataFimChange = (novaData: string) => {
    if (dataInicio && novaData < dataInicio) {
      setDataFim(dataInicio);
    } else {
      setDataFim(novaData);
    }
  };

  return (
    <S.ContainerFiltros>
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
          $ativo={temDataAtiva}
          title="Filtrar por data de criação"
        >
          <Calendar size={18} />
        </S.BotaoCalendario>
      </S.LinhaPrincipal>

      {mostrarDatas && (
        <S.AreaDatas>
          <div className="campo-data">
            <label>Início:</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => handleDataInicioChange(e.target.value)}
              max={dataFim || undefined}
            />
          </div>

          <div className="campo-data">
            <label>Fim:</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => handleDataFimChange(e.target.value)}
              min={dataInicio || undefined}
            />
          </div>

          {temDataAtiva && (
            <Button
              variant="primary" // Ou a variante que você usa para botões de suporte
              size="sm" // Se o seu componente Button suportar um tamanho menor
              onClick={limparFiltrosData}
              type="button"
            >
              Limpar Filtro
            </Button>
          )}
        </S.AreaDatas>
      )}
    </S.ContainerFiltros>
  );
}

// 🎯 EXPORTAÇÃO NOMEADA CORRETA: Vincula o memo diretamente à constante que a Dashboard importa
export const RequestFilters = memo(
  RequestFiltersComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.valor === nextProps.valor &&
      prevProps.dataInicio === nextProps.dataInicio &&
      prevProps.dataFim === nextProps.dataFim &&
      prevProps.placeholder === nextProps.placeholder
    );
  },
);
