import { useState, memo } from "react";
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
} from "lucide-react";
import { ModalPaymentDetails } from "../ModalPaymentDetails";

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
}

function RequestCardComponent({
  item,
  currentUserId,
  isPagador,
  onEdit,
  onDelete,
  onPay,
}: RequestCardProps) {
  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);

  const temDadosPagamento =
    item.forma_pagamento === "pix" ||
    item.forma_pagamento === "transferencia" ||
    item.forma_pagamento === "link_pagamento" ||
    !!item.valor;

  return (
    <>
      <S.CardContainer className={`card-status-${item.status}`}>
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
        </div>
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
      prevProps.currentUserId === nextProps.currentUserId &&
      prevProps.isPagador === nextProps.isPagador
    );
  },
);
