import { useState } from "react";
import { supabase } from "../../lib/supabase";

import * as S from "./styles";

interface Solicitacao {
  id: string;
  titulo: string;
  descricao: string;
  link_compra: string;
  status: string;
  boleto_url: string;
  comprovante_url: string;
  user_id: string;
}

interface NovaSolicitacaoProps {
  onSucesso: () => void;
  dadosParaEditar: Solicitacao | null;
}

export function NovaSolicitacao({
  onSucesso,
  dadosParaEditar,
}: NovaSolicitacaoProps) {
  // Inicializa o estado diretamente com a prop (Evita o erro de renderizações em cascata)
  const [titulo, setTitulo] = useState(dadosParaEditar?.titulo || "");
  const [descricao, setDescricao] = useState(dadosParaEditar?.descricao || "");
  const [linkCompra, setLinkCompra] = useState(
    dadosParaEditar?.link_compra || "",
  );

  const [arquivoBoleto, setArquivoBoleto] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  // 🎯 FUNÇÃO HELPER: Transforma texto bagunçado em padrão Title Case (Primeiras Letras Maiúsculas)
  function toTitleCase(str: string) {
    return str
      .toLowerCase()
      .split(" ")
      .filter((word) => word.trim() !== "") // Evita que múltiplos espaços quebrem o mapeamento
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      // 🎯 APLICAÇÃO DAS REGRAS: Remove espaços nas pontas e força a primeira letra maiúscula em cada palavra do título
      const tituloLimpo = toTitleCase(titulo.trim());
      const descricaoLimpa = descricao.trim();
      const linkCompraLimpo = linkCompra.trim();

      let urlBoleto = dadosParaEditar?.boleto_url || "";

      // Se o usuário selecionou um arquivo de boleto/orçamento novo
      if (arquivoBoleto) {
        const fileExt = arquivoBoleto.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("documentos-solicitacao")
          .upload(fileName, arquivoBoleto);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("documentos-solicitacao")
          .getPublicUrl(fileName);

        urlBoleto = urlData.publicUrl;
      }

      if (dadosParaEditar) {
        // Fluxo de Edição utilizando os valores higienizados
        const { error } = await supabase
          .from("solicitacoes")
          .update({
            titulo: tituloLimpo,
            descricao: descricaoLimpa,
            link_compra: linkCompraLimpo,
            boleto_url: urlBoleto,
          })
          .eq("id", dadosParaEditar.id);

        if (error) throw error;
      } else {
        // Fluxo de Criação utilizando os valores higienizados
        const { error } = await supabase.from("solicitacoes").insert([
          {
            titulo: tituloLimpo,
            descricao: descricaoLimpa,
            link_compra: linkCompraLimpo,
            boleto_url: urlBoleto,
            status: "pendente",
            user_id: user.id,
          },
        ]);

        if (error) throw error;
      }

      onSucesso();
    } catch (err: unknown) {
      alert("Erro ao salvar solicitação: " + (err as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <S.Form onSubmit={handleSubmit}>
      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: 700,
          marginBottom: "8px",
          color: "#0f172a",
        }}
      >
        {dadosParaEditar ? "Editar Solicitação" : "Nova Solicitação"}
      </h2>

      <S.InputGroup>
        <label>Título do Item</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Monitor Dell 24 polegadas"
          required
        />
      </S.InputGroup>

      <S.InputGroup>
        <label>Descrição Detalhada</label>
        <S.TextArea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Insira as especificações técnicas, marca, quantidade, dados para pagamento ou observações..."
          required
        />
      </S.InputGroup>

      <S.InputGroup>
        <label>Link para Compra (Opcional)</label>
        <input
          type="url"
          value={linkCompra}
          onChange={(e) => setLinkCompra(e.target.value)}
          placeholder="https://exemplo.com/produto"
        />
      </S.InputGroup>

      <S.InputGroup>
        <label>Anexar Boleto ou Orçamento (PDF/Imagem)</label>
        <input
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) =>
            setArquivoBoleto(e.target.files ? e.target.files[0] : null)
          }
        />
      </S.InputGroup>

      <S.ButtonContainer>
        <button type="submit" className="btn-submit" disabled={enviando}>
          {enviando
            ? "Salvando..."
            : dadosParaEditar
              ? "Salvar Alterações"
              : "Criar Solicitação"}
        </button>
      </S.ButtonContainer>
    </S.Form>
  );
}
