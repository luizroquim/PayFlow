import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { NovaSolicitacao } from "../../components/NovaSolicitacao";
import { useNavigate } from "react-router-dom";
import { Filtros } from "../../components/Filtros";
import { CardSolicitacao } from "../../components/CardSolicitacao";

// 🎯 OTIMIZADO: Importações limpas e organizadas
import { ModalFinalizarProcesso } from "../../components/ModalFinalizarProcesso";
import { ModalExcluirSolicitacao } from "../../components/ModalExcluirSolicitacao";

import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
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

  // Controla a modal de Criar/Editar solicitação
  const [mostrarModal, setMostrarModal] = useState(false);
  const [solicitacaoParaEditar, setSolicitacaoParaEditar] = useState<Solicitacao | null>(null);

  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [itemEmPagamento, setItemEmPagamento] = useState<Solicitacao | null>(null);

  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [idItemParaExcluir, setIdItemParaExcluir] = useState<string | null>(null);

  const [carregando, setCarregando] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>("");
  const [isPagador, setIsPagador] = useState(false);
  const navigate = useNavigate();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6;

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
          .select(`*, perfis (nome_completo)`)
          .eq("status", abaAtiva);

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
  }, [abaAtiva, currentUserId, isPagador]);

  const handleTrocaAba = (novaAba: "pendente" | "comprado") => {
    if (abaAtiva === novaAba || carregando) {
      return;
    }

    setCarregando(true);
    setAbaAtiva(novaAba);
    setPaginaAtual(1);
  };

  async function forcarAtualizacaoManual() {
    if (!currentUserId) return;
    setCarregando(true);
    try {
      let query = supabase
        .from("solicitacoes")
        .select(`*, perfis (nome_completo)`)
        .eq("status", abaAtiva);

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
  }

  const solicitacoesFiltradas = solicitacoes.filter((item) => {
    const termo = filtro.toLowerCase();
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

    return bateTexto && bateDataInicio && bateDataFim;
  });

  const totalPaginas = Math.ceil(solicitacoesFiltradas.length / itensPorPagina);
  const paginaSegura = paginaAtual > totalPaginas ? 1 : paginaAtual;

  const indiceUltimoItem = paginaSegura * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const cardsDaPaginaAtual = solicitacoesFiltradas.slice(
    indicePrimeiroItem,
    indiceUltimoItem,
  );

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

      <S.MainContent>
        <Filtros
          valor={filtro}
          setValor={setFiltro}
          dataInicio={dataInicio}
          setDataInicio={setDataInicio}
          dataFim={dataFim}
          setDataFim={setDataFim}
        />

        <S.TabContainer>
          <S.TabButton
            isActive={abaAtiva === "pendente"}
            disabled={carregando}
            onClick={() => handleTrocaAba("pendente")}
            tabType="pendente"
          >
            Pedentes
          </S.TabButton>
          <S.TabButton
            isActive={abaAtiva === "comprado"}
            disabled={carregando}
            onClick={() => handleTrocaAba("comprado")}
            tabType="comprado"
          >
            Concluídas
          </S.TabButton>
        </S.TabContainer>

        <S.CardsStack>
          {carregando ? (
            <S.EmptyState
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <Loader2 className="animate-spin" size={28} color="#079cdc" />
              Buscando solicitações atualizadas...
            </S.EmptyState>
          ) : cardsDaPaginaAtual.length > 0 ? (
            cardsDaPaginaAtual.map((item) => (
              <CardSolicitacao
                key={item.id}
                item={item}
                currentUserId={currentUserId}
                isPagador={isPagador}
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
            ))
          ) : (
            <S.EmptyState>
              Nenhuma solicitação encontrada com este termo.
            </S.EmptyState>
          )}
        </S.CardsStack>

        {totalPaginas > 1 && !carregando && (
          <S.PaginationContainer>
            <S.PaginationButton
              onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaSegura === 1}
            >
              <ChevronLeft size={16} /> Anterior
            </S.PaginationButton>

            {Array.from({ length: totalPaginas }, (_, index) => (
              <S.PaginationButton
                key={index + 1}
                isActive={paginaSegura === index + 1}
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
              Próximo <ChevronRight size={16} />
            </S.PaginationButton>
          </S.PaginationContainer>
        )}
      </S.MainContent>

      {/* 1. MODAL: NOVA / EDITAR SOLICITAÇÃO */}
      {mostrarModal && (
        <S.ModalOverlay>
          <S.ModalContent maxWidth="950px">
            <NovaSolicitacao
              key={solicitacaoParaEditar?.id || "nova-solicitacao"}
              onSucesso={async () => {
                setMostrarModal(false);
                await forcarAtualizacaoManual();
              }}
              dadosParaEditar={solicitacaoParaEditar}
              onClose={() => setMostrarModal(false)} // 🎯 ENVIADO: Botão removido do HTML e passado via Prop
            />
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {/* 2. MODAL ISOLADA: FINALIZAR PROCESSO (ANEXAR COMPROVANTE) */}
      {mostrarModalPagamento && itemEmPagamento && (
        <S.ModalOverlay>
          <ModalFinalizarProcesso
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

      {/* 3. MODAL ISOLADA: CONFIRMAR EXCLUSÃO */}
      {mostrarModalExcluir && idItemParaExcluir && (
        <S.ModalOverlay>
          <ModalExcluirSolicitacao
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