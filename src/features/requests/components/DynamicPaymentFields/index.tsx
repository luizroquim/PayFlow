import { memo } from "react";
import { Controller, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import * as S from "./styles";
import {
  aplicarCpfCnpj,
  aplicarMascaraMoeda,
} from "../../../../utils/formatters";

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

interface DynamicPaymentFieldsProps {
  control: Control<FormInputs>;
}

const REGEX_CPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const REGEX_CNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const REGEX_TELEFONE = /^\(\d{2}\)\s\d{5}-\d{4}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 🎯 PERFORMANCE: Componente envelopado com memo() para evitar re-renderizações desnecessárias
export const DynamicPaymentFields = memo(function DynamicPaymentFields({ 
  control 
}: DynamicPaymentFieldsProps) {
  const formaPagamento = useWatch({ control, name: "forma_pagamento" });
  const tipoChavePix = useWatch({ control, name: "pix_tipo" });

  function aplicarMascaraCelular(v: string) {
    let digitos = v.replace(/\D/g, "").substring(0, 11);
    digitos = digitos.replace(/^(\d{2})(\d)/g, "($1) $2");
    digitos = digitos.replace(/(\d{5})(\d)/, "$1-$2");
    return digitos;
  }

  function obterPlaceholderPix() {
    switch (tipoChavePix) {
      case "cnpj_cpf":
        return "CPF ou CNPJ";
      case "celular":
        return "(00) 90000-0000";
      case "email":
        return "nome@empresa.com";
      case "aleatoria":
        return "Chave EVP de 36 caracteres";
      case "copia_cola":
        return "Cole o código BR.GOV.PIX...";
      default:
        return "Digite a chave...";
    }
  }

  return (
    <>
      <S.GridDuplo>
        <S.InputGroup>
          <label htmlFor="select-forma-pagamento">Forma de Pagamento</label>
          <Controller
            name="forma_pagamento"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <select {...field} id="select-forma-pagamento">
                <option value="">Selecione</option>
                <option value="boleto">Boleto</option>
                <option value="pix">PIX</option>
                <option value="transferencia">Transferência (TED/DOC)</option>
                <option value="link_pagamento">Link de Pagamento</option>
                <option value="dinheiro">Dinheiro</option>
              </select>
            )}
          />
        </S.InputGroup>

        <S.InputGroup>
          <label htmlFor="input-valor">Valor (R$)</label>
          <Controller
            name="valor"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <input
                {...field}
                id="input-valor"
                type="text"
                placeholder="R$ 0,00"
                value={aplicarMascaraMoeda(field.value || "")}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          />
        </S.InputGroup>
      </S.GridDuplo>

      {formaPagamento === "link_pagamento" && (
        <S.BlocoDinamicoAnimado>
          <S.InputGroup>
            <label htmlFor="input-link-pagamento">
              URL do Link de Pagamento
            </label>
            <Controller
              name="pix_chave"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <input
                  {...field}
                  id="input-link-pagamento"
                  type="url"
                  placeholder="https://link.operadora.com.br/sua-cobranca/..."
                  required
                />
              )}
            />
          </S.InputGroup>
        </S.BlocoDinamicoAnimado>
      )}

      {formaPagamento === "pix" && (
        <S.BlocoDinamicoAnimado>
          <S.GridPix>
            <div style={{ gridColumn: "1 / -1" }}>
              <S.InputGroup>
                <label htmlFor="pix-nome-favorecido">Nome do Favorecido</label>
                <Controller
                  name="ted_favorecido"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <input
                      {...field}
                      id="pix-nome-favorecido"
                      type="text"
                      placeholder="Nome completo"
                      required
                    />
                  )}
                />
              </S.InputGroup>
            </div>

            <S.InputGroup>
              <label htmlFor="select-tipo-pix">Tipo de Chave</label>
              <Controller
                name="pix_tipo"
                control={control}
                defaultValue="cnpj_cpf"
                render={({ field }) => (
                  <select {...field} id="select-tipo-pix">
                    <option value="cnpj_cpf">CPF / CNPJ</option>
                    <option value="celular">Celular</option>
                    <option value="email">E-mail</option>
                    <option value="aleatoria">Aleatória</option>
                    <option value="copia_cola">Copia e Cola</option>
                  </select>
                )}
              />
            </S.InputGroup>

            <S.InputGroup>
              <label htmlFor="input-chave-pix">
                {tipoChavePix === "copia_cola"
                  ? "Código Copia e Cola"
                  : "Chave PIX"}
              </label>
              <Controller
                name="pix_chave"
                control={control}
                defaultValue=""
                rules={{
                  validate: (v) => {
                    if (!v) return true;
                    if (
                      tipoChavePix === "cnpj_cpf" &&
                      !(REGEX_CPF.test(v) || REGEX_CNPJ.test(v))
                    )
                      return "CPF ou CNPJ incompleto.";
                    if (tipoChavePix === "celular" && !REGEX_TELEFONE.test(v))
                      return "Telefone incompleto.";
                    if (tipoChavePix === "email" && !REGEX_EMAIL.test(v))
                      return "E-mail inválido.";
                    return true;
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      id="input-chave-pix"
                      type="text"
                      placeholder={obterPlaceholderPix()}
                      value={
                        tipoChavePix === "cnpj_cpf"
                          ? aplicarCpfCnpj(field.value || "")
                          : tipoChavePix === "celular"
                            ? aplicarMascaraCelular(field.value || "")
                            : field.value || ""
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                      required
                    />
                    {error && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#0284c7",
                          fontWeight: 600,
                          marginTop: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <AlertCircle size={14} style={{ flexShrink: 0 }} />{" "}
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </S.InputGroup>
          </S.GridPix>
        </S.BlocoDinamicoAnimado>
      )}

      {formaPagamento === "transferencia" && (
        <S.BlocoDinamicoAnimado>
          <S.GridTedLinhaUm>
            <S.InputGroup>
              <label htmlFor="ted-banco">Banco</label>
              <Controller
                name="ted_banco"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    id="ted-banco"
                    type="text"
                    placeholder="Ex: Itaú"
                  />
                )}
              />
            </S.InputGroup>

            <S.InputGroup>
              <label htmlFor="ted-agencia">Ag.</label>
              <Controller
                name="ted_agencia"
                control={control}
                defaultValue=""
                rules={{
                  validate: (v) =>
                    !v ||
                    v.length === 4 ||
                    "Agência inválida (mínimo 4 dígitos).",
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      id="ted-agencia"
                      type="text"
                      placeholder="0001"
                      value={
                        field.value?.replace(/\D/g, "").substring(0, 4) || ""
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {error && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#0284c7",
                          fontWeight: 600,
                          marginTop: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <AlertCircle size={14} /> {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </S.InputGroup>

            <S.InputGroup>
              <label htmlFor="ted-conta">Conta Corrente</label>
              <Controller
                name="ted_conta"
                control={control}
                defaultValue=""
                rules={{
                  validate: (v) =>
                    !v ||
                    v.replace("-", "").length >= 5 ||
                    "Conta corrente incompleta.",
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      id="ted-conta"
                      type="text"
                      placeholder="12345-6"
                      value={(() => {
                        let v = (field.value || "").replace(/\D/g, "");
                        if (v.length > 1)
                          v = v.replace(/(\d+)(\d{1})$/, "$1-$2");
                        return v;
                      })()}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {error && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#0284c7",
                          fontWeight: 600,
                          marginTop: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <AlertCircle size={14} /> {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </S.InputGroup>
          </S.GridTedLinhaUm>

          <S.GridTedLinhaDois>
            <S.InputGroup>
              <label htmlFor="ted-favorecido-doc">CPF/CNPJ Favorecido</label>
              <Controller
                name="ted_cpf_cnpj"
                control={control}
                defaultValue=""
                rules={{
                  validate: (v) =>
                    !v ||
                    REGEX_CPF.test(v) ||
                    REGEX_CNPJ.test(v) ||
                    "CPF ou CNPJ incompleto.",
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      {...field}
                      id="ted-favorecido-doc"
                      type="text"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      value={aplicarCpfCnpj(field.value || "")}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                    {error && (
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: "#0284c7",
                          fontWeight: 600,
                          marginTop: "6px",
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <AlertCircle size={14} style={{ flexShrink: 0 }} />{" "}
                        {error.message}
                      </span>
                    )}
                  </>
                )}
              />
            </S.InputGroup>

            <S.InputGroup>
              <label htmlFor="ted-nome-titular">
                Nome do Favorecido / Titular
              </label>
              <Controller
                name="ted_favorecido"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <input
                    {...field}
                    id="ted-nome-titular"
                    type="text"
                    placeholder="Nome completo"
                  />
                )}
              />
            </S.InputGroup>
          </S.GridTedLinhaDois>
        </S.BlocoDinamicoAnimado>
      )}
    </>
  );
});