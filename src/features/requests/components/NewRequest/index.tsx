import { memo } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "../../../../lib/supabase";
import emailjs from "@emailjs/browser";
import { FileText } from "lucide-react";
import { DynamicPaymentFields } from "../DynamicPaymentFields";
import * as S from "./styles";

export interface Solicitacao {
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

interface NewRequestProps {
  onSucesso: () => void;
  dadosParaEditar: Solicitacao | null;
  onClose: () => void;
}

interface PagadorPerfil {
  id: string;
  nome_completo: string | null;
  email: string | null;
}

interface FormInputs {
  titulo: string;
  descricao: string;
  link_compra: string;
  forma_pagamento: string;
  valor: string;
  pix_tipo: string;
  pix_chave: string;
  ted_banco: string;
  ted_agencia: string;
  ted_conta: string;
  ted_cpf_cnpj: string;
  ted_favorecido: string;
  boleto_file: File | null;
  anexo_existente_url: string;
  is_submitting: boolean;
}

// 🧠 FUNÇÕES PURAS EXTERNALIZADAS: Isoladas fora do escopo do componente
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

// 🎯 PERFORMANCE: Componente agora utiliza memo() para evitar re-renders da Dashboard
export const NewRequest = memo(function NewRequest({
  onSucesso,
  dadosParaEditar,
  onClose,
}: NewRequestProps) {
  const { control, register, handleSubmit, watch, setValue } =
    useForm<FormInputs>({
      mode: "onBlur",
      defaultValues: {
        titulo: dadosParaEditar?.titulo || "",
        descricao: dadosParaEditar?.descricao || "",
        link_compra: dadosParaEditar?.link_compra || "",
        forma_pagamento: dadosParaEditar?.forma_pagamento || "",
        valor: dadosParaEditar?.valor || "",
        pix_tipo: dadosParaEditar?.pix_tipo || "cnpj_cpf",
        pix_chave: dadosParaEditar?.pix_chave || "",
        ted_banco: dadosParaEditar?.ted_banco || "",
        ted_agencia: dadosParaEditar?.ted_agencia || "",
        ted_conta: dadosParaEditar?.ted_conta || "",
        ted_cpf_cnpj: dadosParaEditar?.ted_cpf_cnpj || "",
        ted_favorecido: dadosParaEditar?.ted_favorecido || "",
        boleto_file: null,
        anexo_existente_url: dadosParaEditar?.boleto_url || "",
        is_submitting: false,
      },
    });

  const arquivoBoleto = watch("boleto_file");
  const anexoExistenteUrl = watch("anexo_existente_url");
  const enviando = watch("is_submitting");

  async function onSubmitForm(data: FormInputs) {
    setValue("is_submitting", true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const tituloLimpo = toTitleCase(data.titulo.trim());
      const descricaoLimpa = data.descricao.trim();
      const linkCompraLimpo = data.link_compra.trim();

      let urlBoleto = data.anexo_existente_url;

      if (data.boleto_file) {
        const fileExt = data.boleto_file.name.split(".").pop();
        const nomeOriginalLimpo = data.boleto_file.name
          .replace(`.${fileExt}`, "")
          .replace(/\s+/g, "_");
        const fileName = `${crypto.randomUUID()}-${nomeOriginalLimpo}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("documentos-solicitacao")
          .upload(fileName, data.boleto_file);

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
        forma_pagamento: data.forma_pagamento || null,
        valor: data.valor || null,
        pix_tipo: data.forma_pagamento === "pix" ? data.pix_tipo : null,
        pix_chave:
          data.forma_pagamento === "pix" ||
          data.forma_pagamento === "link_pagamento"
            ? data.pix_chave
            : null,
        ted_banco:
          data.forma_pagamento === "transferencia" ? data.ted_banco : null,
        ted_agencia:
          data.forma_pagamento === "transferencia" ? data.ted_agencia : null,
        ted_conta:
          data.forma_pagamento === "transferencia" ? data.ted_conta : null,
        ted_cpf_cnpj:
          data.forma_pagamento === "transferencia" ? data.ted_cpf_cnpj : null,
        ted_favorecido:
          data.forma_pagamento === "transferencia" ||
          data.forma_pagamento === "pix"
            ? data.ted_favorecido
            : null,
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
                    valor: data.valor || "Não informado",
                  },
                  "6i9UszG5Qr_Afz3zi",
                );
              }
            });
            await Promise.all(envios);
          }
        } catch (mailErr) {
          console.error("❌ Erro no serviço do EmailJS:", mailErr);
        }
      }

      onSucesso();
    } catch (err) {
      alert("Erro ao salvar solicitação: " + (err as Error).message);
    } finally {
      setValue("is_submitting", false);
    }
  }

  return (
    <S.Form onSubmit={handleSubmit(onSubmitForm)}>
      <S.TituloModal>
        {dadosParaEditar ? "Editar Solicitação" : "Nova Solicitação"}
      </S.TituloModal>

      <S.ColunaEsquerda>
        <S.InputGroup>
          <label>Título do Item</label>
          <input
            type="text"
            placeholder="Ex: Monitor Dell 24 polegadas"
            required
            {...register("titulo")}
          />
        </S.InputGroup>

        <S.InputGroup>
          <label>Descrição Detalhada</label>
          <S.TextArea
            placeholder="Insira as especificações técnicas, marca, quantidade..."
            required
            {...register("descricao")}
          />
        </S.InputGroup>

        <S.InputGroup>
          <label>Link para Compra (Opcional)</label>
          <input
            type="url"
            placeholder="https://exemplo.com/produto"
            {...register("link_compra")}
          />
        </S.InputGroup>
      </S.ColunaEsquerda>

      <S.ColunaDireita>
        <CamposPaymentDynamicsWrapper control={control} />

        <S.InputGroup>
          <label>Anexar Boleto ou Orçamento (PDF/Imagem)</label>

          {anexoExistenteUrl ? (
            <S.AnexoEditContainer>
              <S.NomeArquivo
                onClick={() => window.open(anexoExistenteUrl, "_blank")}
              >
                <FileText size={18} color="#64748b" style={{ flexShrink: 0 }} />
                <span>{obterNomeDoAnexo(anexoExistenteUrl)}</span>
              </S.NomeArquivo>
              <S.BtnTextoRemover
                type="button"
                onClick={() => {
                  setValue("anexo_existente_url", "");
                  setValue("boleto_file", null);
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
                      <FileText
                        size={18}
                        color="#1e293b"
                        style={{ flexShrink: 0 }}
                      />
                      <S.TextoNomeFiltrado>
                        {arquivoBoleto.name}
                      </S.TextoNomeFiltrado>
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
                      setValue("boleto_file", null);
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
                    setValue("boleto_file", e.target.files[0]);
                  }
                }}
              />
            </S.AnexoNovoContainer>
          )}
        </S.InputGroup>
      </S.ColunaDireita>

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
});

const CamposPaymentDynamicsWrapper = memo(DynamicPaymentFields);