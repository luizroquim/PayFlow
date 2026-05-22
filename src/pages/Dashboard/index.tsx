import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

// IMPORTAÇÕES DA FEATURE: Alinhadas in inglês e apontando para a estrutura unificada
import {
  RequestFilters,
  RequestList,
  NewRequest,
  ModalCompleteProcess,
  ModalDeleteRequest,
} from "../../features/requests";
import { LogOut, Loader2 } from "lucide-react";
import icon from "../../assets/icon.ico";
import * as S from "./styles";

export interface Solicitacao {
  id: string;
  titulo: string;
  descricao: string;
  link_compra: string;
  status: string;
  created_at: string;
  data_pagamento: string | null;
  boleto_url: string;
  comprovante_url: string;
  user_id: string;
  forma_pagamento?: string;
  valor?: string;
  pix_tipo?: string;
  pix_chave?: string;
  ted_banco?: string;
  ted_agencia?: string;
  ted_conta?: string;
  ted_cpf_cnpj?: string;
  ted_favorecido?: string;
  perfis?: {
    nome_completo: string;
  };
}

export function Dashboard() {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [abaAtiva, setAbaAtiva] = useState<"pendente" | "comprado">("pendente");
  const [filtro, setFiltro] = useState("");

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Controladores de Modais
  const [mostrarModal, setMostrarModal] = useState(false);
  const [solicitacaoParaEditar, setSolicitacaoParaEditar] =
    useState<Solicitacao | null>(null);

  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [itemEmPagamento, setItemEmPagamento] = useState<Solicitacao | null>(
    null,
  );

  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [idItemParaExcluir, setIdItemParaExcluir] = useState<string | null>(
    null,
  );

  const [carregando, setCarregando] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>("");
  const [isPagador, setIsPagador] = useState(false);
  const navigate = useNavigate();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6;

  const secaoSolicitacoesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (secaoSolicitacoesRef.current) {
      secaoSolicitacoesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [paginaAtual]);

  // 1. Inicializa a sessão do usuário e define funções/permissões
  useEffect(() => {
    async function inicializarUsuario() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/");
        return;
      }

      setCurrentUserId(session.user.id);
      setUserEmail(session.user.email);

      const { data: perfil } = await supabase
        .from("perfis")
        .select("funcao")
        .eq("id", session.user.id)
        .single();

      setIsPagador(perfil?.funcao === "pagador");
    }

    inicializarUsuario();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // 2. Carrega TODOS os dados (sem filtrar abaAtiva no banco) e escuta Realtime
  useEffect(() => {
    let ativo = true;

    async function carregarDadosDoBanco() {
      if (!currentUserId) return;

      try {
        let query = supabase
          .from("solicitacoes")
          .select(`*, perfis (nome_completo)`);

        if (!isPagador) {
          query = query.eq("user_id", currentUserId);
        }

        const { data, error = null } = await query.order("created_at", {
          ascending: false,
        });

        if (ativo && !error && data) {
          setSolicitacoes(data as Solicitacao[]);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarDadosDoBanco();

    const canalRealtime = supabase
      .channel("mudancas-solicitacoes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "solicitacoes",
        },
        () => {
          carregarDadosDoBanco();
        },
      )
      .subscribe();

    return () => {
      ativo = false;
      supabase.removeChannel(canalRealtime);
    };
  }, [currentUserId, isPagador]);

  // 3. Atualização manual sem filtro de banco para bater com a nova lógica
  const forcarAtualizacaoManual = useCallback(async () => {
    if (!currentUserId) return;
    setCarregando(true);
    try {
      let query = supabase
        .from("solicitacoes")
        .select(`*, perfis (nome_completo)`);

      if (!isPagador) query = query.eq("user_id", currentUserId);

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });
      if (!error && data) setSolicitacoes(data as Solicitacao[]);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  }, [currentUserId, isPagador]);

  // 4. A troca de abas agora é instantânea. Não ativa o esqueleto de "carregando"
  const handleTrocaAba = (novaAba: "pendente" | "comprado") => {
    if (abaAtiva === novaAba) return;

    setAbaAtiva(novaAba);
    setPaginaAtual(1);
  };

  // 5. Filtra os dados na memória cache (incluindo o status da aba)
  const solicitacoesFiltradas = useMemo(() => {
    const termo = filtro.toLowerCase().trim();

    return solicitacoes.filter((item) => {
      const bateAba = item.status === abaAtiva;

      const bateTexto =
        item.titulo.toLowerCase().includes(termo) ||
        (item.perfis?.nome_completo || "").toLowerCase().includes(termo);

      const dataItem = new Date(item.created_at).setHours(0, 0, 0, 0);

      const bateDataInicio = dataInicio
        ? dataItem >= new Date(dataInicio + "T00:00:00").setHours(0, 0, 0, 0)
        : true;

      const bateDataFim = dataFim
        ? dataItem <= new Date(dataFim + "T00:00:00").setHours(0, 0, 0, 0)
        : true;

      return bateAba && bateTexto && bateDataInicio && bateDataFim;
    });
  }, [solicitacoes, abaAtiva, filtro, dataInicio, dataFim]);

  // Separação de fatias de paginação em cache síncrono
  const calculoPaginacao = useMemo(() => {
    const totalPaginas = Math.ceil(
      solicitacoesFiltradas.length / itensPorPagina,
    );
    const paginaSegura = paginaAtual > totalPaginas ? 1 : paginaAtual;

    const indiceUltimoItem = paginaSegura * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const cardsDaPaginaAtual = solicitacoesFiltradas.slice(
      indicePrimeiroItem,
      indiceUltimoItem,
    );

    return {
      totalPaginas,
      paginaSegura,
      cardsDaPaginaAtual,
    };
  }, [solicitacoesFiltradas, paginaAtual, itensPorPagina]);

  const { totalPaginas, paginaSegura, cardsDaPaginaAtual } = calculoPaginacao;

  return (
    <S.Container>
      <S.Header>
        <div className="brand-wrapper">
          <div className="logo-box">
            <img src={icon} alt="" />
          </div>
          <h2>Gestão de Pagamentos</h2>
        </div>

        <div className="user-controls">
          <span className="user-email">{userEmail}</span>
          <button
            className="btn-new-request"
            onClick={() => {
              setSolicitacaoParaEditar(null);
              setMostrarModal(true);
            }}
          >
            + Nova Solicitação
          </button>
          <button
            className="btn-logout"
            onClick={() => {
              supabase.auth.signOut();
              navigate("/");
            }}
          >
            <LogOut size={19} />
          </button>
        </div>
      </S.Header>

      <S.MainContent
        ref={secaoSolicitacoesRef}
        style={{ scrollMarginTop: "24px" }}
      >
        <RequestFilters
          valor={filtro}
          setValor={setFiltro}
          dataInicio={dataInicio}
          setDataInicio={setDataInicio}
          dataFim={dataFim}
          setDataFim={setDataFim}
        />

        <S.TabContainer>
          <S.TabButton
            $isActive={abaAtiva === "pendente"}
            onClick={() => handleTrocaAba("pendente")}
            $tabType="pendente"
          >
            Pendentes
          </S.TabButton>
          <S.TabButton
            $isActive={abaAtiva === "comprado"}
            onClick={() => handleTrocaAba("comprado")}
            $tabType="comprado"
          >
            Concluídas
          </S.TabButton>
        </S.TabContainer>

        {carregando ? (
          <S.CardsStack>
            <S.EmptyState
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <Loader2 className="animate-spin" size={28} color="#079cdc" />
              Buscando solicitações...
            </S.EmptyState>
          </S.CardsStack>
        ) : cardsDaPaginaAtual.length > 0 ? (
          <RequestList
            cardsDaPaginaAtual={cardsDaPaginaAtual}
            currentUserId={currentUserId}
            isPagador={isPagador}
            totalPaginas={totalPaginas}
            paginaSegura={paginaSegura}
            setPaginaAtual={setPaginaAtual}
            onEdit={(itemEditar) => {
              setSolicitacaoParaEditar(itemEditar);
              setMostrarModal(true);
            }}
            onDelete={(id) => {
              setIdItemParaExcluir(id);
              setMostrarModalExcluir(true);
            }}
            onPay={(itemPagar) => {
              setItemEmPagamento(itemPagar);
              setMostrarModalPagamento(true);
            }}
          />
        ) : (
          <S.CardsStack>
            <S.EmptyState>
              Nenhuma solicitação encontrada com este termo.
            </S.EmptyState>
          </S.CardsStack>
        )}
      </S.MainContent>

      {/* 1. MODAL: NOVA / EDITAR SOLICITAÇÃO (Mantido rígido - fecha apenas no botão) */}
      {mostrarModal && (
        <S.ModalOverlay>
          <S.ModalContent $maxWidth="950px">
            <NewRequest
              key={solicitacaoParaEditar?.id || "nova-solicitacao"}
              onSucesso={async () => {
                setMostrarModal(false);
                await forcarAtualizacaoManual();
              }}
              dadosParaEditar={solicitacaoParaEditar}
              onClose={() => setMostrarModal(false)}
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* 2. MODAL: FINALIZAR PROCESSO (Fecha ao clicar fora) */}
      {mostrarModalPagamento && itemEmPagamento && (
        <S.ModalOverlay
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMostrarModalPagamento(false);
              setItemEmPagamento(null);
            }
          }}
        >
          <ModalCompleteProcess
            itemEmPagamento={itemEmPagamento}
            onClose={() => {
              setMostrarModalPagamento(false);
              setItemEmPagamento(null);
            }}
            onSucesso={async () => {
              setMostrarModalPagamento(false);
              setItemEmPagamento(null);
              await forcarAtualizacaoManual();
            }}
          />
        </S.ModalOverlay>
      )}

      {/* 3. MODAL: CONFIRMAR EXCLUSÃO (Fecha ao clicar fora) */}
      {mostrarModalExcluir && idItemParaExcluir && (
        <S.ModalOverlay
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setMostrarModalExcluir(false);
              setIdItemParaExcluir(null);
            }
          }}
        >
          <ModalDeleteRequest
            idItemParaExcluir={idItemParaExcluir}
            onClose={() => {
              setMostrarModalExcluir(false);
              setIdItemParaExcluir(null);
            }}
            onSucesso={async () => {
              setMostrarModalExcluir(false);
              setIdItemParaExcluir(null);
              await forcarAtualizacaoManual();
            }}
          />
        </S.ModalOverlay>
      )}
    </S.Container>
  );
}