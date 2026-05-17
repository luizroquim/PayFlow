import { useState } from "react";
import { supabase } from "../../lib/supabase";
import emailjs from "@emailjs/browser"; // 🎯 Importa a biblioteca do EmailJS

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

// 🎯 Definimos a interface para o TypeScript do VS Code entender o formato do Pagador
interface PagadorPerfil {
  id: string;
  nome_completo: string | null;
  email: string | null;
}

export function NovaSolicitacao({
  onSucesso,
  dadosParaEditar,
}: NovaSolicitacaoProps) {
  const [titulo, setTitulo] = useState(dadosParaEditar?.titulo || "");
  const [descricao, setDescricao] = useState(dadosParaEditar?.descricao || "");
  const [linkCompra, setLinkCompra] = useState(
    dadosParaEditar?.link_compra || "",
  );

  const [arquivoBoleto, setArquivoBoleto] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  function toTitleCase(str: string) {
    return str
      .toLowerCase()
      .split(" ")
      .filter((word) => word.trim() !== "")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);

    console.log(
      "打 Botão salvar clicado! Estado atual de dadosParaEditar:",
      dadosParaEditar,
    );

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const tituloLimpo = toTitleCase(titulo.trim());
      const descricaoLimpa = descricao.trim();
      const linkCompraLimpo = linkCompra.trim();

      let urlBoleto = dadosParaEditar?.boleto_url || "";

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
        // Fluxo de Edição
        console.log("📝 Atualizando solicitação existente...");
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
        // Fluxo de Criação
        console.log("💾 Salvando nova solicitação no Supabase...");
        const { error: insertError } = await supabase
          .from("solicitacoes")
          .insert([
            {
              titulo: tituloLimpo,
              descricao: descricaoLimpa,
              link_compra: linkCompraLimpo,
              boleto_url: urlBoleto,
              status: "pendente",
              user_id: user.id,
            },
          ]);

        if (insertError) throw insertError;
        console.log("✅ Solicitação salva no banco com sucesso!");

        // 🎯 BLOCO DO EMAILJS SEGURO E TIPADO
        try {
          console.log("=== 🚀 INICIANDO DISPARO DE NOTIFICAÇÃO ===");

          // Buscamos direto da tabela perfis apontando a interface PagadorPerfil[]
          const { data: pagadores, error: perfisError } = await supabase
            .from("perfis")
            .select("id, nome_completo, email")
            .eq("funcao", "pagador");

          if (perfisError) {
            console.error(
              "❌ Erro do Supabase ao buscar perfis de pagadores:",
              perfisError,
            );
          }

          console.log("🔍 Lista de pagadores retornada do Banco:", pagadores);

          if (pagadores && pagadores.length > 0) {
            // Convertemos explicitamente para o tipo correto para o VS Code parar de reclamar
            const listaPagadores = pagadores as PagadorPerfil[];

            const envios = listaPagadores.map(async (pagador) => {
              if (pagador.email) {
                console.log(
                  `✉️ Tentando enviar via EmailJS para: ${pagador.email}`,
                );

                const resposta = await emailjs.send(
                  "service_duk9ekt",
                  "template_w0kvdw5",
                  {
                    solicitante: user.email,
                    titulo: tituloLimpo,
                    email_pagador: pagador.email,
                  },
                  "6i9UszG5Qr_Afz3zi",
                );

                console.log(`✅ Sucesso para [${pagador.email}]:`, resposta);
                return resposta;
              }
            });

            await Promise.all(envios);
            console.log(
              "=== 🎉 FIM DO FLUXO: Todos os e-mails processados ===",
            );
          } else {
            console.warn(
              "⚠️ O e-mail não foi enviado porque nenhum usuário com funcao = 'pagador' foi encontrado.",
            );
          }
        } catch (mailErr) {
          console.error("❌ Erro capturado no serviço do EmailJS:", mailErr);
        }
      }

      console.log("🔄 Fechando a modal através do onSucesso()...");
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
