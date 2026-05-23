export interface FormInputs {
  titulo: string;
  descricao: string;
  link_compra?: string | null;
  forma_pagamento?: string | null;
  valor?: string | null;
  pix_tipo: string;
  pix_chave?: string | null;
  ted_banco?: string | null;
  ted_agencia?: string | null;
  ted_conta?: string | null;
  ted_cpf_cnpj?: string | null;
  ted_favorecido?: string | null;
  boleto_file?: File | null;
  anexo_existente_url?: string | null;
  is_submitting: boolean;
}
