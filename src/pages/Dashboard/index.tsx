import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Header } from "../../features/requests/components/Header";
import { NotificationToggle } from "../../features/requests/components/NotificationToggle";
import { Loader2 } from "lucide-react";
import { Modal } from "../../features/requests/components/UI";
import { useSincronizarDispositivoPush } from "../../hooks/useSincronizarDispositivoPush";


import { TabSelector } from "../../features/requests/components/TabSelector";

import {
  RequestFilters,
  RequestList,
  NewRequest,
  ModalCompleteProcess,
  ModalDeleteRequest,
} from "../../features/requests";

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
  revertida_em?: string | null;
  motivo_reversao?: string | null;
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

  // 🎯 ADICIONADO: Estado para monitorar novidades em tempo real na aba de Concluídas
  const [temNovaConcluida, setTemNovaConcluida] = useState(false);

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

  useSincronizarDispositivoPush(currentUserId || undefined);

  useEffect(() => {
    if (secaoSolicitacoesRef.current) {
      secaoSolicitacoesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [paginaAtual]);

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
        (payload) => {
          carregarDadosDoBanco();

         
          if (
            payload.eventType === "UPDATE" ||
            payload.eventType === "INSERT"
          ) {
            const novoStatus = payload.new?.status;
            if (novoStatus === "comprado") {
              setTemNovaConcluida(true);
            }
          }
        },
      )
      .subscribe();

    return () => {
      ativo = false;
      supabase.removeChannel(canalRealtime);
    };
  }, [currentUserId, isPagador]);

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

  const handleDesfazerConclusao = useCallback(
    async (idSolicitacao: string, motivo: string) => {
      try {
        const { error } = await supabase
          .from("solicitacoes")
          .update({
            status: "pendente",
            data_pagamento: null,
            comprovante_url: "",
            revertida_em: new Date().toISOString(),
            motivo_reversao: motivo, // 🎯 SALVA O MOTIVO NO BANCO
          })
          .eq("id", idSolicitacao);

        if (error) throw error;

        await forcarAtualizacaoManual();
      } catch (e) {
        console.error("Erro ao desfazer conclusão:", e);
        alert("Não foi possível reverter esta solicitação.");
      }
    },
    [forcarAtualizacaoManual],
  );

 
  const handleTrocaAba = (novaAba: "pendente" | "comprado") => {
    if (abaAtiva === novaAba) return;

    if (novaAba === "comprado") {
      setTemNovaConcluida(false);
    }

    setAbaAtiva(novaAba);
    setPaginaAtual(1);
  };

  // 🎯 ADICIONADO: Conta a quantidade total de registros estritamente pendentes
  const totalPendentesCount = useMemo(() => {
    return solicitacoes.filter((item) => item.status === "pendente").length;
  }, [solicitacoes]);

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
      <Header
        userEmail={userEmail}
        onNovaSolicitacao={() => {
          setSolicitacaoParaEditar(null);
          setMostrarModal(true);
        }}
        onLogout={() => {
          supabase.auth.signOut();
          navigate("/");
        }}
      />

      <S.MainContent
        ref={secaoSolicitacoesRef}
        style={{ scrollMarginTop: "24px" }}
      >
        <NotificationToggle />

        <RequestFilters
          valor={filtro}
          setValor={setFiltro}
          dataInicio={dataInicio}
          setDataInicio={setDataInicio}
          dataFim={dataFim}
          setDataFim={setDataFim}
        />

        {/* 🎯 ALTERADO: Substituído o HTML rígido pelo novo componente isolado */}
        <TabSelector
          abaAtiva={abaAtiva}
          onTrocaAba={handleTrocaAba}
          totalPendentes={totalPendentesCount}
          temNovaConcluida={temNovaConcluida}
        />

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
            onDesfazer={handleDesfazerConclusao}
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

      {/* 1. MODAL: NOVA / EDITAR SOLICITAÇÃO */}
      {mostrarModal && (
        <Modal maxWidth="950px" fullScreenOnMobile>
          <NewRequest
            key={solicitacaoParaEditar?.id || "nova-solicitacao"}
            onSucesso={async () => {
              setMostrarModal(false);
              await forcarAtualizacaoManual();
            }}
            dadosParaEditar={solicitacaoParaEditar}
            onClose={() => setMostrarModal(false)}
          />
        </Modal>
      )}

      {/* 2. MODAL: FINALIZAR PROCESSO */}
      {mostrarModalPagamento && itemEmPagamento && (
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
      )}

      {/* 3. MODAL: CONFIRMAR EXCLUSÃO */}
      {mostrarModalExcluir && idItemParaExcluir && (
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
      )}
    </S.Container>
  );
}
