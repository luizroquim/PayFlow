import { useState, memo } from "react";
import { supabase } from "../../../../lib/supabase";
import { Button, Modal } from "../../components/UI"; // 🎯 Importamos Button e Modal do mesmo lugar

interface ModalDeleteRequestProps {
  onClose: () => void; // Fecha a modal se o usuário cancelar
  idItemParaExcluir: string; // ID único do item que será deletado
  onSucesso: () => void; // Recarrega a lista da Dashboard após excluir
}

// 🎯 BLINDADO: memo() garante que alterações na Dashboard não fiquem travando ou re-renderizando a modal à toa
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
    // 🎯 Trocamos a <div> estilizada pelo Modal global com variant="confirm"
    <Modal variant="confirm" onClose={onClose}>
      <h3>Excluir Solicitação?</h3>
      <p>
        Esta ação não poderá ser desfeita. O item será removido permanentemente
        do fluxo de pagamentos.
      </p>

      <div className="actions">
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
          {/* Como seu Button já mostra "Processando...", ele gerencia sozinho o texto de carregamento */}
          Sim, excluir
        </Button>
      </div>
    </Modal>
  );
});