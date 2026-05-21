import { useState } from "react";
import { supabase } from "../../lib/supabase";
import emailjs from "@emailjs/browser";
import { FileText } from "lucide-react";
import { CamposPagamentoDinamicos } from "../CamposPagamentosDinamicos";
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
  forma_pagamento?: string;
  valor?: string;
  pix_tipo?: string;
  pix_chave?: string;
  ted_banco?: string;
  ted_agencia?: string;
  ted_conta?: string;
  ted_cpf_cnpj?: string;
  ted_favorecido?: string;
}

interface NovaSolicitacaoProps {
  onSucesso: () => void;
  dadosParaEditar: Solicitacao | null;
  onClose: () => void; // 🎯 ADICIONADO: Prop para lidar com o fechamento vindo da Dashboard
}

interface PagadorPerfil {
  id: string;
  nome_completo: string | null;
  email: string | null;
}

export function NovaSolicitacao({
  onSucesso,
  dadosParaEditar,
  onClose, // 🎯 ADICIONADO: Recebendo a função de fechar
}: NovaSolicitacaoProps) {
  const [titulo, setTitulo] = useState(dadosParaEditar?.titulo || "");
  const [descricao, setDescricao] = useState(dadosParaEditar?.descricao || "");
  const [linkCompra, setLinkCompra] = useState(dadosParaEditar?.link_compra || "");

  const [formaPagamento, setFormaPagamento] = useState(dadosParaEditar?.forma_pagamento || "");
  const [valor, setValor] = useState(dadosParaEditar?.valor || "");
  const [tipoChavePix, setTipoChavePix] = useState(dadosParaEditar?.pix_tipo || "cnpj_cpf");
  const [chavePix, setChavePix] = useState(dadosParaEditar?.pix_chave || "");
  const [bancoTed, setBancoTed] = useState(dadosParaEditar?.ted_banco || "");
  const [agenciaTed, setAgenciaTed] = useState(dadosParaEditar?.ted_agencia || "");
  const [contaTed, setContaTed] = useState(dadosParaEditar?.ted_conta || "");
  const [cpfCnpjFavorecido, setCpfCnpjFavorecido] = useState(dadosParaEditar?.ted_cpf_cnpj || "");
  const [nomeFavorecido, setNomeFavorecido] = useState(dadosParaEditar?.ted_favorecido || "");

  const [arquivoBoleto, setArquivoBoleto] = useState<File | null>(null);
  const [anexoExistenteUrl, setAnexoExistenteUrl] = useState<string>(dadosParaEditar?.boleto_url || "");
  const [enviando, setEnviando] = useState(false);

  function toTitleCase(str: string) {
    return str
      .toLowerCase()
      .split(" ")
      .filter((word) => word.trim() !== "")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function obterNomeDoAnexo(url: string) {
    try {
      if (!url) return "Visualizar documento atual";
      const urlSemQuery = url.split("?")[0];
      const partes = urlSemQuery.split("/");
      const nomeCompleto = decodeURIComponent(partes[partes.length - 1]);

      if (
        nomeCompleto.charAt(8) === "-" &&
        nomeCompleto.charAt(13) === "-" &&
        nomeCompleto.charAt(18) === "-"
      ) {
        const nomeReal = nomeCompleto.slice(37);
        return nomeReal || "Documento Anexado";
      }
      return nomeCompleto;
    } catch (error) {
      console.error("❌ Erro ao tratar nome do anexo:", error);
      return "Visualizar documento atual";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const tituloLimpo = toTitleCase(titulo.trim());
      const descricaoLimpa = descricao.trim();
      const linkCompraLimpo = linkCompra.trim();

      let urlBoleto = anexoExistenteUrl;

      if (arquivoBoleto) {
        const fileExt = arquivoBoleto.name.split(".").pop();
        const nomeOriginalLimpo = arquivoBoleto.name.replace(`.${fileExt}`, "").replace(/\s+/g, "_");
        const fileName = `${crypto.randomUUID()}-${nomeOriginalLimpo}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("documentos-solicitacao")
          .upload(fileName, arquivoBoleto);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("documentos-solicitacao")
          .getPublicUrl(fileName);

        urlBoleto = urlData.publicUrl;
      }

      const dadosPayload = {
        titulo: tituloLimpo,
        descricao: descricaoLimpa,
        link_compra: linkCompraLimpo,
        boleto_url: urlBoleto,
        forma_pagamento: formaPagamento || null,
        valor: valor || null,
        pix_tipo: formaPagamento === "pix" ? tipoChavePix : null,
        pix_chave: (formaPagamento === "pix" || formaPagamento === "link_pagamento") ? chavePix : null,
        ted_banco: formaPagamento === "transferencia" ? bancoTed : null,
        ted_agencia: formaPagamento === "transferencia" ? agenciaTed : null,
        ted_conta: formaPagamento === "transferencia" ? contaTed : null,
        ted_cpf_cnpj: formaPagamento === "transferencia" ? cpfCnpjFavorecido : null,
        // 🎯 ATUALIZADO: Agora salva o nome do favorecido se for TED OU se for PIX
        ted_favorecido: (formaPagamento === "transferencia" || formaPagamento === "pix") ? nomeFavorecido : null,
      };

      if (dadosParaEditar) {
        const { error } = await supabase
          .from("solicitacoes")
          .update(dadosPayload)
          .eq("id", dadosParaEditar.id);

        if (error) throw error;
      } else {
        const { error: insertError } = await supabase
          .from("solicitacoes")
          .insert([{ ...dadosPayload, status: "pendente", user_id: user.id }]);

        if (insertError) throw insertError;

        try {
          const { data: pagadores } = await supabase
            .from("perfis")
            .select("id, nome_completo, email")
            .eq("funcao", "pagador");

          if (pagadores && pagadores.length > 0) {
            const listaPagadores = pagadores as PagadorPerfil[];
            const envios = listaPagadores.map(async (pagador) => {
              if (pagador.email) {
                return await emailjs.send(
                  "service_duk9ekt",
                  "template_w0kvdw5",
                  {
                    solicitante: user.email,
                    titulo: tituloLimpo,
                    email_pagador: pagador.email,
                    valor: valor || "Não informado"
                  },
                  "6i9UszG5Qr_Afz3zi"
                );
              }
            });
            await Promise.all(envios);
          }
        } catch (mailErr) {
          console.error("❌ Erro capturado no serviço do EmailJS:", mailErr);
        }
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
      <S.TituloModal>
        {dadosParaEditar ? "Editar Solicitação" : "Nova Solicitação"}
      </S.TituloModal>

      {/* 👈 COLUNA DA ESQUERDA: Dados do Item */}
      <S.ColunaEsquerda>
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
            placeholder="Insira as especificações técnicas, marca, quantidade..."
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
      </S.ColunaEsquerda>

      {/* 👉 COLUNA DA DIREITA: Dados Financeiros e de Pagamento */}
      <S.ColunaDireita>
        <CamposPagamentoDinamicos
          formaPagamento={formaPagamento}
          setFormaPagamento={setFormaPagamento}
          valor={valor}
          setValor={setValor}
          tipoChavePix={tipoChavePix}
          setTipoChavePix={setTipoChavePix}
          chavePix={chavePix}
          setChavePix={setChavePix}
          bancoTed={bancoTed}
          setBancoTed={setBancoTed}
          agenciaTed={agenciaTed}
          setAgenciaTed={setAgenciaTed}
          contaTed={contaTed}
          setContaTed={setContaTed}
          cpfCnpjFavorecido={cpfCnpjFavorecido}
          setCpfCnpjFavorecido={setCpfCnpjFavorecido}
          nomeFavorecido={nomeFavorecido}
          setNomeFavorecido={setNomeFavorecido}
        />

        <S.InputGroup>
          <label>Anexar Boleto ou Orçamento (PDF/Imagem)</label>

          {anexoExistenteUrl ? (
            <S.AnexoEditContainer>
              <S.NomeArquivo onClick={() => window.open(anexoExistenteUrl, "_blank")}>
                <FileText size={18} color="#64748b" style={{ flexShrink: 0 }} />
                <span>{obterNomeDoAnexo(anexoExistenteUrl)}</span>
              </S.NomeArquivo>
              <S.BtnTextoRemover
                type="button"
                onClick={() => {
                  setAnexoExistenteUrl("");
                  setArquivoBoleto(null);
                }}
              >
                Remover
              </S.BtnTextoRemover>
            </S.AnexoEditContainer>
          ) : (
            <S.AnexoNovoContainer>
              <S.LabelAnexoCustomizado htmlFor="upload-boleto-nova-solicitacao">
                <S.TextoPlaceholder>
                  {arquivoBoleto ? (
                    <S.NomeArquivoNovo>
                      <FileText size={18} color="#1e293b" style={{ flexShrink: 0 }} />
                      <S.TextoNomeFiltrado>{arquivoBoleto.name}</S.TextoNomeFiltrado>
                    </S.NomeArquivoNovo>
                  ) : (
                    "Nenhum arquivo anexado..."
                  )}
                </S.TextoPlaceholder>

                {arquivoBoleto ? (
                  <S.BtnLimparArquivoNovo
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setArquivoBoleto(null);
                    }}
                  >
                    Remover
                  </S.BtnLimparArquivoNovo>
                ) : (
                  <S.BtnTextoAzulNativo>Anexar Arquivo</S.BtnTextoAzulNativo>
                )}
              </S.LabelAnexoCustomizado>

              <S.InputFileInvisivel
                id="upload-boleto-nova-solicitacao"
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setArquivoBoleto(e.target.files[0]);
                  }
                }}
              />
            </S.AnexoNovoContainer>
          )}
        </S.InputGroup>
      </S.ColunaDireita>

      {/* 🎯 RODAPÉ ATUALIZADO: Botões posicionados lado a lado de forma limpa */}
      <S.ButtonContainer>
        <button 
          type="button" 
          className="btn-cancelar" 
          onClick={onClose} 
          disabled={enviando}
        >
          Voltar para a lista
        </button>

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