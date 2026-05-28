import { useState, memo, useRef } from "react";
import * as S from "./styles";
import {
  SquarePen,
  Trash2,
  BanknoteArrowUp,
  ExternalLink,
  Paperclip,
  CircleCheckBig,
  Calendar1,
  Clock,
  Coins,
  Undo2,
  TriangleAlert,
  
} from "lucide-react";
import { ModalPaymentDetails } from "../ModalPaymentDetails";
import { Button, Input } from "../../components/UI"; 

interface Solicitacao {
  id: string;
  titulo: string;
  descricao: string;
  link_compra: string;
  status: string;
  created_at: string;
  data_pagamento: string | null;
  boleto_url: string;
  comprovante_url: string;
  user_id: string;
  revertida_em?: string | null;
  motivo_reversao?: string | null; 
  forma_pagamento?: string;
  valor?: string;
  pix_tipo?: string;
  pix_chave?: string;
  ted_banco?: string;
  ted_agencia?: string;
  ted_conta?: string;
  ted_cpf_cnpj?: string;
  ted_favorecido?: string;
  perfis?: {
    nome_completo: string;
  };
}

interface RequestCardProps {
  item: Solicitacao;
  currentUserId: string | null;
  isPagador: boolean;
  onEdit: (item: Solicitacao) => void;
  onDelete: (id: string) => void;
  onPay: (item: Solicitacao) => void;
  onDesfazer: (id: string, motivo: string) => void; 
}

function RequestCardComponent({
  item,
  currentUserId,
  isPagador,
  onEdit,
  onDelete,
  onPay,
  onDesfazer,
}: RequestCardProps) {
  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [estaConfirmandoDesfazer, setEstaConfirmandoDesfazer] = useState(false);
  const [erroValidacao, setErroValidacao] = useState("");
  const motivoInputRef = useRef<HTMLInputElement>(null);

  const temDadosPagamento =
    item.forma_pagamento === "pix" ||
    item.forma_pagamento === "transferencia" ||
    item.forma_pagamento === "link_pagamento" ||
    !!item.valor;

  const handleConfirmarReversao = () => {
    const textoMotivo = motivoInputRef.current?.value || "";

    if (!textoMotivo.trim()) {
      setErroValidacao("O motivo do cancelamento é obrigatório.");
      return;
    }

    setErroValidacao("");
    setEstaConfirmandoDesfazer(false);
    onDesfazer(item.id, textoMotivo);
  };

  return (
    <>
      <S.CardContainer className={`card-status-${item.status}`}>
        {item.status === "pendente" && item.revertida_em && (
          <S.AlertaCancelamento>
            <div className="header-alerta">
              <TriangleAlert size={18} />
              <span className="badge-erro">Pagamento Recusado</span>
            </div>

            <p>
              Cancelado em:{" "}
              <strong>
                {new Date(item.revertida_em).toLocaleDateString("pt-BR")} às{" "}
                {new Date(item.revertida_em).toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </strong>
            </p>
            
            {item.motivo_reversao && (
              <p style={{ marginTop: "4px" }}>
                Motivo: <strong>{item.motivo_reversao}</strong>
              </p>
            )}
            
            <span className="status-aguarda">Aguardando novo pagamento...</span>
          </S.AlertaCancelamento>
        )}

        <div className="card-header">
          <div>
            <h3>{item.titulo}</h3>
            <p className="requested-by">
              Solicitado por: <strong>{item.perfis?.nome_completo}</strong>
            </p>
          </div>

          <S.Badge $status={item.status}>
            {item.status === "pendente" ? (
              <Clock size={13} />
            ) : (
              <CircleCheckBig size={13} />
            )}
            {item.status === "pendente" ? "Pendente" : "Concluído"}
          </S.Badge>
        </div>

        <div className="card-description">{item.descricao}</div>

        <div className="card-links">
          {temDadosPagamento && (
            <button
              type="button"
              className="link-payment-info"
              onClick={() => setMostrarModalPagamento(true)}
            >
              <Coins size={14} /> Dados Para Pagamento
            </button>
          )}

          {item.link_compra && (
            <a
              href={item.link_compra}
              target="_blank"
              rel="noreferrer"
              className="link-product"
            >
              <ExternalLink size={14} /> Link do Produto
            </a>
          )}

          {item.boleto_url && (
            <a
              href={item.boleto_url}
              target="_blank"
              rel="noreferrer"
              className="link-invoice"
            >
              <Paperclip size={14} /> Ver Anexo
            </a>
          )}

          {item.comprovante_url && (
            <a
              href={item.comprovante_url}
              target="_blank"
              rel="noreferrer"
              className="link-receipt"
            >
              <CircleCheckBig size={14} /> Ver Comprovante
            </a>
          )}
        </div>

        <div className="card-dates">
          <span>
            <Calendar1 size={14} /> Criado em:{" "}
            {new Date(item.created_at).toLocaleString("pt-BR")}
          </span>
          {item.data_pagamento && (
            <span className="payment-date">
              <BanknoteArrowUp size={14} /> Pago em:{" "}
              {new Date(item.data_pagamento).toLocaleString("pt-BR")}
            </span>
          )}
        </div>

        <div className="card-footer-actions">
          <div className="user-actions">
            {item.user_id === currentUserId && item.status === "pendente" && (
              <>
                <button className="btn-edit" onClick={() => onEdit(item)}>
                  <SquarePen size={15} />
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>

          {isPagador && item.status === "pendente" && (
            <button className="btn-confirm-payment" onClick={() => onPay(item)}>
              Confirmar Pagamento
            </button>
          )}

          {isPagador && item.status === "comprado" && !estaConfirmandoDesfazer && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setEstaConfirmandoDesfazer(true)}
              title="Mover de volta para pendentes"
            >
              <Undo2 size={14} />
              Desfazer Pagamento
            </Button>
          )}
        </div>

        {estaConfirmandoDesfazer && (
          <S.AreaConfirmacaoEstorno>
            <Input
              name="motivo"
              label="Motivo da Recusa do Pagamento"
              placeholder="Ex: Comprovante ilegível ou valor divergente..."
              ref={motivoInputRef}
              error={erroValidacao}
            />
            <S.AcoesConfirmacao>
              <S.BotaoConfirmacaoEstorno
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEstaConfirmandoDesfazer(false);
                  setErroValidacao("");
                }}
              >
                 Cancelar
              </S.BotaoConfirmacaoEstorno>
              
              <S.BotaoConfirmacaoEstorno
                type="button"
                variant="danger"
                size="sm"
                onClick={handleConfirmarReversao}
              >
                Confirmar Estorno
              </S.BotaoConfirmacaoEstorno>
            </S.AcoesConfirmacao>
          </S.AreaConfirmacaoEstorno>
        )}
      </S.CardContainer>

      {mostrarModalPagamento && (
        <ModalPaymentDetails
          solicitacao={item}
          onClose={() => setMostrarModalPagamento(false)}
        />
      )}
    </>
  );
}

export const RequestCard = memo(
  RequestCardComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.status === nextProps.item.status &&
      prevProps.item.titulo === nextProps.item.titulo &&
      prevProps.item.descricao === nextProps.item.descricao &&
      prevProps.item.boleto_url === nextProps.item.boleto_url &&
      prevProps.item.comprovante_url === nextProps.item.comprovante_url &&
      prevProps.item.revertida_em === nextProps.item.revertida_em &&
      prevProps.item.motivo_reversao === nextProps.item.motivo_reversao && 
      prevProps.currentUserId === nextProps.currentUserId &&
      prevProps.isPagador === nextProps.isPagador
    );
  },
);