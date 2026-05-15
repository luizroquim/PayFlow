import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { NovaSolicitacao } from "../components/NovaSolicitacao";
import { useNavigate } from "react-router-dom";

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
  const [mostrarModal, setMostrarModal] = useState(false);
  const [solicitacaoParaEditar, setSolicitacaoParaEditar] = useState<Solicitacao | null>(null);
  
  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [itemEmPagamento, setItemEmPagamento] = useState<Solicitacao | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | undefined>("");
  const [isPagador, setIsPagador] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarDados();
  }, [abaAtiva]);

  async function carregarDados() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/"); return; }
    
    setCurrentUserId(user.id);
    setUserEmail(user.email);

    const { data: perfil } = await supabase.from("perfis").select("funcao").eq("id", user.id).single();
    const pagador = perfil?.funcao === "pagador";
    setIsPagador(pagador);

    let query = supabase.from("solicitacoes").select(`*, perfis (nome_completo)`).eq("status", abaAtiva);
    
    // Se não for pagador, vê apenas as suas próprias solicitações
    if (!pagador) query = query.eq("user_id", user.id);

    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error) setSolicitacoes(data as Solicitacao[] || []);
  }

  async function confirmarPagamento() {
    if (!itemEmPagamento) return;
    setEnviando(true);

    try {
      let urlComprovante = "";
      if (arquivo) {
        const fileExt = arquivo.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        
        const { error: upErr } = await supabase.storage
          .from('documentos-solicitacao')
          .upload(fileName, arquivo);

        if (upErr) throw upErr;

        const { data: urlData } = supabase.storage.from('documentos-solicitacao').getPublicUrl(fileName);
        urlComprovante = urlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("solicitacoes")
        .update({ 
          status: "comprado", 
          comprovante_url: urlComprovante,
          data_pagamento: new Date().toISOString()
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

  async function excluirSolicitacao(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta solicitação?")) return;
    const { error } = await supabase.from("solicitacoes").delete().eq("id", id);
    if (error) alert("Erro ao excluir");
    else carregarDados();
  }

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
      {/* HEADER */}
      <header style={{ backgroundColor: "#fff", padding: "15px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: "#0284c7", color: "#fff", padding: "8px", borderRadius: "8px" }}>🏥</div>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Gestão de Compras</h2>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "0.85rem", color: "#64748b" }}>{userEmail}</span>
          <button 
            onClick={() => { setSolicitacaoParaEditar(null); setMostrarModal(true); }} 
            style={{ backgroundColor: "#0284c7", color: "#fff", border: "none", padding: "10px 18px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            + Nova Solicitação
          </button>
          <button onClick={() => { supabase.auth.signOut(); navigate("/"); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}>🚪</button>
        </div>
      </header>

      <main style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px" }}>
        {/* ABAS */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", backgroundColor: "#f1f5f9", padding: "5px", borderRadius: "12px", width: "fit-content" }}>
          <button onClick={() => setAbaAtiva("pendente")} style={{ padding: "10px 25px", borderRadius: "10px", border: "none", cursor: "pointer", backgroundColor: abaAtiva === "pendente" ? "#fff" : "transparent", color: abaAtiva === "pendente" ? "#0284c7" : "#64748b", fontWeight: 600, boxShadow: abaAtiva === "pendente" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}>Pendentes</button>
          <button onClick={() => setAbaAtiva("comprado")} style={{ padding: "10px 25px", borderRadius: "10px", border: "none", cursor: "pointer", backgroundColor: abaAtiva === "comprado" ? "#fff" : "transparent", color: abaAtiva === "comprado" ? "#10b981" : "#64748b", fontWeight: 600, boxShadow: abaAtiva === "comprado" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}>Concluídas</button>
        </div>

        {/* LISTAGEM */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {solicitacoes.map((item) => (
            <div key={item.id} style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "1.2rem", color: "#0f172a" }}>{item.titulo}</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b" }}>Solicitado por: <strong>{item.perfis?.nome_completo}</strong></p>
                </div>
                <span style={{ backgroundColor: item.status === "pendente" ? "#fff7ed" : "#f0fdf4", color: item.status === "pendente" ? "#c2410c" : "#166534", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>
                  {item.status}
                </span>
              </div>

              <div style={{ margin: "16px 0", fontSize: "0.95rem", lineHeight: "1.6" }}>{item.descricao}</div>

              {/* ANEXOS */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                {item.link_compra && (
                  <a href={item.link_compra} target="_blank" rel="noreferrer" style={{ padding: "8px 14px", borderRadius: "8px", backgroundColor: "#f0f9ff", color: "#0369a1", fontSize: "0.8rem", textDecoration: "none", border: "1px solid #bae6fd" }}>🔗 Link do Produto</a>
                )}
                
                {item.boleto_url && (
                  <a href={item.boleto_url} target="_blank" rel="noreferrer" style={{ padding: "8px 14px", borderRadius: "8px", backgroundColor: "#fff7ed", color: "#c2410c", fontSize: "0.8rem", textDecoration: "none", border: "1px solid #ffedd5", fontWeight: "bold" }}>📄 Ver Boleto/Orçamento</a>
                )}

                {item.comprovante_url && (
                  <a href={item.comprovante_url} target="_blank" rel="noreferrer" style={{ padding: "8px 14px", borderRadius: "8px", backgroundColor: "#f0fdf4", color: "#166534", fontSize: "0.8rem", textDecoration: "none", border: "1px solid #dcfce7", fontWeight: "bold" }}>✅ Ver Comprovante</a>
                )}
              </div>

              {/* DATAS */}
              <div style={{ fontSize: "0.75rem", color: "#94a3b8", display: "flex", gap: "20px", marginBottom: "20px" }}>
                <span>🗓 Criado em: {new Date(item.created_at).toLocaleString("pt-BR")}</span>
                {item.data_pagamento && <span style={{ color: "#10b981", fontWeight: "bold" }}>💰 Pago em: {new Date(item.data_pagamento).toLocaleString("pt-BR")}</span>}
              </div>

              {/* RODAPÉ DO CARD */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f1f5f9", paddingTop: "20px" }}>
                <div style={{ display: "flex", gap: "10px" }}>
                  {item.user_id === currentUserId && item.status === "pendente" && (
                    <>
                      <button onClick={() => { setSolicitacaoParaEditar(item); setMostrarModal(true); }} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#fff", cursor: "pointer", fontSize: "0.85rem" }}>📝 Editar</button>
                      <button onClick={() => excluirSolicitacao(item.id)} style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #fee2e2", color: "#ef4444", backgroundColor: "#fff", cursor: "pointer" }}>🗑️</button>
                    </>
                  )}
                </div>

                {isPagador && item.status === "pendente" && (
                  <button 
                    onClick={() => { setItemEmPagamento(item); setMostrarModalPagamento(true); }} 
                    style={{ backgroundColor: "#10b981", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    💳 Confirmar Pagamento
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL NOVA SOLICITAÇÃO */}
      {mostrarModal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ width: "90%", maxWidth: "480px", backgroundColor: "#fff", borderRadius: "20px", padding: "30px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <NovaSolicitacao
              onSucesso={() => { setMostrarModal(false); carregarDados(); }}
              dadosParaEditar={solicitacaoParaEditar}
            />
            <button onClick={() => setMostrarModal(false)} style={{ width: "100%", marginTop: "15px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "0.85rem" }}>Voltar para a lista</button>
          </div>
        </div>
      )}

      {/* MODAL PAGAMENTO */}
      {mostrarModalPagamento && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 }}>
          <div style={{ backgroundColor: "#fff", padding: "35px", borderRadius: "20px", width: "400px" }}>
            <h3 style={{ marginTop: 0 }}>Finalizar Processo</h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "20px" }}>Carregue o comprovante de transferência ou pagamento bancário.</p>
            
            <input 
              type="file" 
              onChange={(e) => setArquivo(e.target.files ? e.target.files[0] : null)} 
              style={{ marginBottom: "25px", width: "100%" }} 
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <button 
                onClick={confirmarPagamento} 
                disabled={enviando} 
                style={{ flex: 1, padding: "12px", backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}
              >
                {enviando ? "A processar..." : "Confirmar"}
              </button>
              <button 
                onClick={() => { setMostrarModalPagamento(false); setArquivo(null); }} 
                style={{ flex: 1, padding: "12px", backgroundColor: "#f1f5f9", color: "#64748b", border: "none", borderRadius: "10px", cursor: "pointer" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}