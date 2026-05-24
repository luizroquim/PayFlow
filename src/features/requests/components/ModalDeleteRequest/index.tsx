import { useState, memo } from "react";
import { supabase } from "../../../../lib/supabase";
import { Button, Modal } from "../../components/UI"; 
import * as S from "./styles"; 

interface ModalDeleteRequestProps {
  onClose: () => void; // Fecha a modal se o usuário cancelar
  idItemParaExcluir: string; // ID único do item que será deletado
  onSucesso: () => void; // Recarrega a lista da Dashboard após excluir
}


export const ModalDeleteRequest = memo(function ModalDeleteRequest({
  onClose,
  idItemParaExcluir,
  onSucesso,
}: ModalDeleteRequestProps) {
  const [excluindo, setExcluindo] = useState(false);

  async function handleExecutarExclusao() {
    if (!idItemParaExcluir) return;
    setExcluindo(true);

    try {
      const { error } = await supabase
        .from("solicitacoes")
        .delete()
        .eq("id", idItemParaExcluir);

      if (error) {
        throw error;
      }

      onSucesso(); // Avisa a Dashboard para atualizar a lista
    } catch (err) {
      alert("Erro ao excluir solicitação.");
      console.error(err);
    } finally {
      setExcluindo(false);
    }
  }

  return (
    
    <Modal variant="confirm" onClose={onClose}>
      <h3>Excluir Solicitação?</h3>
      <p>
        Esta ação não poderá ser desfeita. O item será removido permanentemente
        do fluxo de pagamentos.
      </p>

      <div className="actions">
        <S.ContainerAcoes>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={excluindo}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={handleExecutarExclusao}
          isLoading={excluindo}
        >
          
          Sim, excluir
        </Button>

        </S.ContainerAcoes>
      </div>
    </Modal>
  );
});