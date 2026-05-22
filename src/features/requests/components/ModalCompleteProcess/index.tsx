import { useState } from "react";
import { FileText } from "lucide-react";
import { supabase } from "../../../../lib/supabase";
import * as S from "./styles";

/* 🎯 NOMES ATUALIZADOS: Interface agora segue o padrão em inglês */
interface ModalCompleteProcessProps {
  onClose: () => void; // Função para fechar a modal
  itemEmPagamento: {
    id: string;
    titulo: string;
  };
  onSucesso: () => void; // Atualiza a lista da Dashboard após o upload
}

/* 🎯 EXPORTAÇÃO DEFINITIVA: Nome da função atualizado para casar com a pasta */
export function ModalCompleteProcess({
  onClose,
  itemEmPagamento,
  onSucesso,
}: ModalCompleteProcessProps) {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function handleConfirmarPagamento() {
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

      setArquivo(null);
      onSucesso(); // Avisa a Dashboard para recarregar a lista e fechar
    } catch (err) {
      const error = err as Error;
      alert("Erro ao processar pagamento: " + error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <S.WrapperModalFinalizar>
      <h3 className="titulo-finalizar">Finalizar Processo</h3>
      <p className="descricao-finalizar">
        Carregue o comprovante de transferência ou pagamento bancário para a
        solicitação: <strong>{itemEmPagamento.titulo}</strong>
      </p>

      <div className="container-upload-file">
        <S.AnexoNovoContainer>
          <S.LabelAnexoCustomizado htmlFor="upload-comprovante-modal">
            <S.TextoPlaceholder>
              {arquivo ? (
                <S.NomeArquivoNovo>
                  <FileText
                    size={18}
                    color="#1e293b"
                    style={{ flexShrink: 0 }}
                  />
                  <S.TextoNomeFiltrado>{arquivo.name}</S.TextoNomeFiltrado>
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
            id="upload-comprovante-modal"
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

      <div className="finalizar-acoes-container">
        <button
          className="btn-cancelar-final"
          type="button"
          onClick={onClose}
          disabled={enviando}
        >
          Cancelar
        </button>

        <button
          className="btn-confirmar-final"
          onClick={handleConfirmarPagamento}
          disabled={enviando}
        >
          {enviando ? "Processando..." : "Confirmar"}
        </button>
      </div>
    </S.WrapperModalFinalizar>
  );
}
