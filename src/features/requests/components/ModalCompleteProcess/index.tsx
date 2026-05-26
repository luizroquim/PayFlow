// src/features/requests/components/ModalCompleteProcess/index.tsx
import { useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { Button, FileUploader, Modal } from "../../components/UI";
import * as S from "./styles"; 

interface ModalCompleteProcessProps {
  onClose: () => void;
  itemEmPagamento: {
    id: string;
    titulo: string;
  };
  onSucesso: () => void;
}

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
    <Modal maxWidth="550px" onClose={onClose}>
      <h3>Finalizar Processo</h3>
      <p className="modal-description">
        Carregue o comprovante de transferência ou pagamento bancário para a
        solicitação: <strong>{itemEmPagamento.titulo}</strong>
      </p>

      <div style={{ marginBottom: "0" }}>
        {/* 🎯 ALTERADO: Passando a nova prop label para customizar o texto do cabeçalho */}
        <FileUploader
          label="Anexar comprovante de pagamento"
          arquivoBoleto={arquivo}
          anexoExistenteUrl=""
          nomeAnexo={arquivo ? arquivo.name : "Nenhum comprovante anexado..."}
          onRemoverAnexo={() => {}}
          onRemoverNovoArquivo={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setArquivo(null);
          }}
          onUploadArquivo={(file) => setArquivo(file)}
        />
      </div>

      <S.ContainerAcoes>
        <Button
          variant="secondary"
          type="button"
          onClick={onClose}
          disabled={enviando}
        >
          Cancelar
        </Button>

        <Button
          variant="confirm"
          onClick={handleConfirmarPagamento}
          isLoading={enviando}
        >
          Confirmar
        </Button>
      </S.ContainerAcoes>
    </Modal>
  );
}