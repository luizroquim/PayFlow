import * as S from "./styles";
import { SquarePen, Trash2, BanknoteArrowUp, ExternalLink, Paperclip, CircleCheckBig, Calendar1, Clock } from 'lucide-react';

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
  perfis?: {
    nome_completo: string;
  };
}

interface CardSolicitacaoProps {
  item: Solicitacao;
  currentUserId: string | null;
  isPagador: boolean;
  onEdit: (item: Solicitacao) => void;
  onDelete: (id: string) => void;
  onPay: (item: Solicitacao) => void;
}

export function CardSolicitacao({
  item,
  currentUserId,
  isPagador,
  onEdit,
  onDelete,
  onPay,
}: CardSolicitacaoProps) {
  return (
    <S.Card>
      <div className="card-header">
        <div>
          <h3>{item.titulo}</h3>
          <p className="requested-by">
            Solicitado por: <strong>{item.perfis?.nome_completo}</strong>
          </p>
        </div>
        
        {/* BADGE AJUSTADO: Injeta o ícone correto dinamicamente antes do texto */}
        <S.Badge status={item.status}>
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
        {item.link_compra && (
          <a href={item.link_compra} target="_blank" rel="noreferrer" className="link-product">
            <ExternalLink size={14}/> Link do Produto
          </a>
        )}

        {item.boleto_url && (
          <a href={item.boleto_url} target="_blank" rel="noreferrer" className="link-invoice">
            <Paperclip size={14} /> Ver Anexo
          </a>
        )}

        {item.comprovante_url && (
          <a href={item.comprovante_url} target="_blank" rel="noreferrer" className="link-receipt">
            <CircleCheckBig size={14}/> Ver Comprovante
          </a>
        )}
      </div>

      <div className="card-dates">
        <span>
          <Calendar1 size={14} /> Criado em: {new Date(item.created_at).toLocaleString("pt-BR")}
        </span>
        {item.data_pagamento && (
          <span className="payment-date">
            <BanknoteArrowUp size={14} /> Pago em: {new Date(item.data_pagamento).toLocaleString("pt-BR")}
          </span>
        )}
      </div>

      <div className="card-footer-actions">
        <div className="user-actions">
          {item.user_id === currentUserId && item.status === "pendente" && (
            <>
              <button className="btn-edit" onClick={() => onEdit(item)}>
                <SquarePen size={15}/>
              </button>
              <button className="btn-delete" onClick={() => onDelete(item.id)}>
                <Trash2 size={15}/>
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
    </S.Card>
  );
}