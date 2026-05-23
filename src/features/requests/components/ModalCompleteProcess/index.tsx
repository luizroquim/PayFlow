import { useState } from "react";
import { supabase } from "../../../../lib/supabase";
import { Button, FileUploader, Modal } from "../../components/UI"; // 🎯 Centralizamos os imports

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
    // 🎯 Utilizamos o Modal global configurando uma largura máxima agradável
    <Modal maxWidth="550px" onClose={onClose}>
      <h3>Finalizar Processo</h3>
      {/* 🎯 A classe modal-description vem nativamente do nosso Modal global */}
      <p className="modal-description">
        Carregue o comprovante de transferência ou pagamento bancário para a
        solicitação: <strong>{itemEmPagamento.titulo}</strong>
      </p>

      {/* Margem simples apenas para afastar o uploader do resto */}
      <div style={{ marginBottom: "20px" }}>
        <FileUploader
          arquivoBoleto={arquivo}
          // Passamos vazio para satisfazer a tipagem, já que é um novo upload
          anexoExistenteUrl=""
          nomeAnexo={arquivo ? arquivo.name : "Nenhum comprovante anexado..."}
          // Função nula pois não há o que remover de um anexo existente ainda
          onRemoverAnexo={() => {}}
          onRemoverNovoArquivo={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setArquivo(null);
          }}
          onUploadArquivo={(file) => setArquivo(file)}
        />
      </div>

      {/* 🎯 A classe finalizar-acoes-container já existe no Modal global alinhando os botões */}
      <div className="finalizar-acoes-container">
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
      </div>
    </Modal>
  );
}