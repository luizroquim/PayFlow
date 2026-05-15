import { useState } from "react";
import { supabase } from "../lib/supabase";

interface Solicitacao {
  id: string;
  titulo: string;
  descricao: string;
  link_compra: string;
  boleto_url: string;
  status: string;
}

interface NovaSolicitacaoProps {
  onSucesso: () => void;
  dadosParaEditar?: Solicitacao | null;
}

export function NovaSolicitacao({
  onSucesso,
  dadosParaEditar,
}: NovaSolicitacaoProps) {
  const [titulo, setTitulo] = useState(dadosParaEditar?.titulo || "");
  const [descricao, setDescricao] = useState(dadosParaEditar?.descricao || "");
  const [link, setLink] = useState(dadosParaEditar?.link_compra || "");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada");

      let urlDoBoleto = dadosParaEditar?.boleto_url || "";

      if (arquivo) {
        const fileExt = arquivo.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        // Alterado para o nome do bucket que você solicitou
        const { error: uploadError } = await supabase.storage
          .from("documentos-solicitacao")
          .upload(fileName, arquivo);

        if (uploadError) {
          throw new Error(
            `Erro: Verifique se o bucket 'documentos-solicitacao' existe no Storage e está como Public.`,
          );
        }

        const { data: urlData } = supabase.storage
          .from("documentos-solicitacao")
          .getPublicUrl(fileName);
        urlDoBoleto = urlData.publicUrl;
      }

      const payload = {
        titulo,
        descricao,
        link_compra: link,
        boleto_url: urlDoBoleto,
        status: "pendente",
        user_id: user.id,
      };

      if (dadosParaEditar) {
        const { error } = await supabase
          .from("solicitacoes")
          .update(payload)
          .eq("id", dadosParaEditar.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("solicitacoes").insert([payload]);
        if (error) throw error;
      }

      onSucesso();
    } catch (err: unknown) {
      alert((err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form
      onSubmit={handleSalvar}
      style={{ display: "flex", flexDirection: "column", gap: "12px" }}
    >
      <h3 style={{ margin: 0 }}>
        {dadosParaEditar ? "Editar Solicitação" : "Nova Solicitação"}
      </h3>
      <input
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />
      <textarea
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />
      <input
        placeholder="Link do Produto"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ddd",
        }}
      />

      <div
        style={{
          padding: "10px",
          border: "1px dashed #ccc",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: "bold",
            marginBottom: "5px",
          }}
        >
          Anexar Boleto/Orçamento:
        </label>
        <input
          type="file"
          onChange={(e) =>
            setArquivo(e.target.files ? e.target.files[0] : null)
          }
        />
      </div>

      <button
        type="submit"
        disabled={enviando}
        style={{
          backgroundColor: "#0284c7",
          color: "white",
          padding: "12px",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        {enviando ? "A carregar..." : "Enviar Solicitação"}
      </button>
    </form>
  );
}
