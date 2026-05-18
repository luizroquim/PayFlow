import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { NovaSolicitacao } from "../../components/NovaSolicitacao";
import { useNavigate } from "react-router-dom";
import { Filtros } from "../../components/Filtros";
import { CardSolicitacao } from "../../components/CardSolicitacao";
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import icon from "../../assets/icon.ico"
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
  const [mostrarModal, setMostrarModal] = useState(false);
  const [solicitacaoParaEditar, setSolicitacaoParaEditar] = useState<Solicitacao | null>(null);

  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [itemEmPagamento, setItemEmPagamento] = useState<Solicitacao | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [idItemParaExcluir, setIdItemParaExcluir] = useState<string | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>("");
  const [isPagador, setIsPagador] = useState(false);
  const navigate = useNavigate();

  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6;

  // 🎯 1. NOVO EFECT: Escudo protetor de autenticação robusto
  useEffect(() => {
    // Checagem inicial sutil ao montar a tela
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/");
      }
    });

    // Ouvinte em tempo real: Só desloga se o evento for explicitamente SIGNED_OUT
    // Ignora o INITIAL_SESSION que causava o bug na troca de abas
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || (!session && event !== "INITIAL_SESSION")) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  // 🎯 2. AJUSTE NO EFFECT DE CARGA: Roda ao mudar de aba ou quando o ID do usuário estabilizar
  useEffect(() => {
    carregarDados();
  }, [abaAtiva, currentUserId]);

  // 🎯 3. FUNÇÃO PURIFICADA: Removemos o "navigate" abrupto daqui de dentro
  async function carregarDados() {
    // Usamos getSession para buscar as informações do usuário atual sem forçar revalidação agressiva
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    
    if (!user) return; // Se não tem usuário ainda, o outro useEffect cuida de expulsar

    setCurrentUserId(user.id);
    setUserEmail(user.email);

    const { data: perfil } = await supabase
      .from("perfis")
      .select("funcao")
      .eq("id", user.id)
      .single();
    
    const pagador = perfil?.funcao === "pagador";
    setIsPagador(pagador);

    let query = supabase
      .from("solicitacoes")
      .select(`*, perfis (nome_completo)`)
      .eq("status", abaAtiva);

    if (!pagador) query = query.eq("user_id", user.id);

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });
    if (!error) setSolicitacoes((data as Solicitacao[]) || []);
  }

  const solicitacoesFiltradas = solicitacoes.filter((item) => {
    const termo = filtro.toLowerCase();
    return (
      item.titulo.toLowerCase().includes(termo) ||
      (item.perfis?.nome_completo || "").toLowerCase().includes(termo)
    );
  });

  const totalPaginas = Math.ceil(solicitacoesFiltradas.length / itensPorPagina);
  const paginaSegura = paginaAtual > totalPaginas ? 1 : paginaAtual;

  const indiceUltimoItem = paginaSegura * itensPorPagina;
  const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
  const cardsDaPaginaAtual = solicitacoesFiltradas.slice(indicePrimeiroItem, indiceUltimoItem);

  async function confirmarPagamento() {
    if (!itemEmPagamento) return;
    setEnviando(true);

    try {
      let urlComprovante = "";
      if (arquivo) {
        const fileExt = arquivo.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

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
      carregarDados();
    } catch (err: unknown) {
      alert("Erro ao processar pagamento: " + (err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  async function executarExclusao() {
    if (!idItemParaExcluir) return;

    const { error } = await supabase
      .from("solicitacoes")
      .delete()
      .eq("id", idItemParaExcluir);

    if (error) {
      alert("Erro ao excluir");
    } else {
      carregarDados();
    }

    setMostrarModalExcluir(false);
    setIdItemParaExcluir(null);
  }

  return (
    <S.Container>
      <S.Header>
        <div className="brand-wrapper">
          <div className="logo-box"> <img src={icon} alt="" /></div>
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
        <Filtros valor={filtro} setValor={setFiltro} />

        <S.TabContainer>
          <S.TabButton
            isActive={abaAtiva === "pendente"}
            onClick={() => {
              setAbaAtiva("pendente");
              setPaginaAtual(1);
            }}
            tabType="pendente"
          >
            Pendentes
          </S.TabButton>
          <S.TabButton
            isActive={abaAtiva === "comprado"}
            onClick={() => {
              setAbaAtiva("comprado");
              setPaginaAtual(1);
            }}
            tabType="comprado"
          >
            Concluídas
          </S.TabButton>
        </S.TabContainer>

        <S.CardsStack>
          {cardsDaPaginaAtual.length > 0 ? (
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

        {totalPaginas > 1 && (
          <S.PaginationContainer>
            <S.PaginationButton 
              onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
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
              onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
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
              onSucesso={() => {
                setMostrarModal(false);
                carregarDados();
              }}
              dadosParaEditar={solicitacaoParaEditar}
            />
            <button className="btn-close-modal" onClick={() => setMostrarModal(false)}>
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

            <input
              type="file"
              className="file-input"
              onChange={(e) => setArquivo(e.target.files ? e.target.files[0] : null)}
            />

            <div className="modal-actions">
              <button className="btn-submit-payment" onClick={confirmarPagamento} disabled={enviando}>
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
            <p>Esta ação não poderá ser desfeita. O item será removido permanentemente do fluxo de pagamentos.</p>
            
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
              >
                Sim, excluir
              </button>
            </div>
          </S.ConfirmModalContent>
        </S.ModalOverlay>
      )}
    </S.Container>
  );
}