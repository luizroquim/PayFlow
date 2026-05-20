import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { NovaSolicitacao } from "../../components/NovaSolicitacao";
import { useNavigate } from "react-router-dom";
import { Filtros } from "../../components/Filtros";
import { CardSolicitacao } from "../../components/CardSolicitacao";
import {
  LogOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";
import icon from "../../assets/icon.ico";
import * as S from "./styles";

interface Solicitacao {
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

  const [mostrarModal, setMostrarModal] = useState(false);
  const [solicitacaoParaEditar, setSolicitacaoParaEditar] =
    useState<Solicitacao | null>(null);

  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [itemEmPagamento, setItemEmPagamento] = useState<Solicitacao | null>(
    null,
  );
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [idItemParaExcluir, setIdItemParaExcluir] = useState<string | null>(
    null,
  );

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

        const { data, error } = await query.order("created_at", {
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

  async function confirmarPagamento() {
    if (!itemEmPagamento) return;
    setEnviando(true);

    try {
      let urlComprovante = "";
      if (arquivo) {
        const fileExt = arquivo.name.split(".").pop();

        const nomeOriginalLimpo = arquivo.name
          .replace(`.${fileExt}`, "")
          .replace(/\s+/g, "_");

        const fileName = `${crypto.randomUUID()}-${nomeOriginalLimpo}.${fileExt}`;

        const { error: upErr } = await supabase.storage
          .from("documentos-solicitacao")
          .upload(fileName, arquivo);

        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage
          .from("documentos-solicitacao")
          .getPublicUrl(fileName);
        urlComprovante = urlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("solicitacoes")
        .update({
          status: "comprado",
          comprovante_url: urlComprovante,
          data_pagamento: new Date().toISOString(),
        })
        .eq("id", itemEmPagamento.id);

      if (updateError) throw updateError;

      setMostrarModalPagamento(false);
      setArquivo(null);

      await forcarAtualizacaoManual();
    } catch (err: unknown) {
      alert("Erro ao processar pagamento: " + (err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  async function executarExclusao() {
    if (!idItemParaExcluir) return;
    setExcluindo(true); // 🎯 LIGA O CARREGAMENTO DA EXCLUSÃO

    const { error } = await supabase
      .from("solicitacoes")
      .delete()
      .eq("id", idItemParaExcluir);

    if (error) {
      alert("Erro ao excluir");
    } else {
      await forcarAtualizacaoManual();
    }

    setMostrarModalExcluir(false);
    setIdItemParaExcluir(null);
    setExcluindo(false); // 🎯 DESLIGA O CARREGAMENTO
  }

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
            Pendentes
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

      {mostrarModal && (
        <S.ModalOverlay>
          <S.ModalContent maxWidth="480px">
            <NovaSolicitacao
              key={solicitacaoParaEditar?.id || "nova-solicitacao"}
              onSucesso={async () => {
                setMostrarModal(false);
                await forcarAtualizacaoManual();
              }}
              dadosParaEditar={solicitacaoParaEditar}
            />
            {/* 🎯 SEU BOTÃO RESTAURADO: */}
            <button
              className="btn-close-modal"
              onClick={() => setMostrarModal(false)}
            >
              Voltar para a lista
            </button>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {mostrarModalPagamento && (
        <S.ModalOverlay>
          <S.ModalContent maxWidth="400px">
            <h3>Finalizar Processo</h3>
            <p className="modal-description">
              Carregue o comprovante de transferência ou pagamento bancário.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                margin: "16px 0",
              }}
            >
              <S.AnexoNovoContainer>
                <S.LabelAnexoCustomizado htmlFor="upload-comprovante-dashboard">
                  <S.TextoPlaceholder>
                    {arquivo ? (
                      <S.NomeArquivoNovo>
                        <FileText
                          size={18}
                          color="#1e293b"
                          style={{ flexShrink: 0 }}
                        />
                        <S.TextoNomeFiltrado>
                          {arquivo.name}
                        </S.TextoNomeFiltrado>
                      </S.NomeArquivoNovo>
                    ) : (
                      "Nenhum comprovante anexado..."
                    )}
                  </S.TextoPlaceholder>

                  {arquivo ? (
                    <S.BtnLimparArquivoNovo
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setArquivo(null);
                      }}
                    >
                      Remover
                    </S.BtnLimparArquivoNovo>
                  ) : (
                    <S.BtnTextoAzulNativo>Anexar Arquivo</S.BtnTextoAzulNativo>
                  )}
                </S.LabelAnexoCustomizado>

                <S.InputFileInvisivel
                  id="upload-comprovante-dashboard"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setArquivo(e.target.files[0]);
                    }
                  }}
                />
              </S.AnexoNovoContainer>
            </div>

            <div className="modal-actions">
              <button
                className="btn-submit-payment"
                onClick={confirmarPagamento}
                disabled={enviando} // 🎯 CORRIGIDO: Anexo opcional (bloqueia apenas no envio)
              >
                {enviando ? "A processar..." : "Confirmar"}
              </button>
              <button
                className="btn-cancel-payment"
                onClick={() => {
                  setMostrarModalPagamento(false);
                  setArquivo(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      {mostrarModalExcluir && (
        <S.ModalOverlay>
          <S.ConfirmModalContent>
            <h3>Excluir Solicitação?</h3>
            <p>
              Esta ação não poderá ser desfeita. O item será removido
              permanentemente do fluxo de pagamentos.
            </p>

            <div className="actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setMostrarModalExcluir(false);
                  setIdItemParaExcluir(null);
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-delete"
                onClick={executarExclusao}
                disabled={excluindo} // 🎯 BLOQUEIA O BOTÃO ENQUANTO EXCLUI
              >
                {excluindo ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </S.ConfirmModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
}
