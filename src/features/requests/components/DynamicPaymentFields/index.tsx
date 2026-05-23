import { memo } from "react";
import { Controller, useFormState, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import * as S from "./styles";
import {
  aplicarCpfCnpj,
  aplicarMascaraMoeda,
} from "../../../../utils/formatters";
import type { FormInputs } from "../NewRequest/types";

interface DynamicPaymentFieldsProps {
  control: Control<FormInputs>;
}

const REGEX_CPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const REGEX_CNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const REGEX_TELEFONE = /^\(\d{2}\)\s\d{5}-\d{4}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 🎯 PERFORMANCE: Componente envelopado com memo() para evitar re-renderizações desnecessárias
export const DynamicPaymentFields = memo(function DynamicPaymentFields({
  control,
}: DynamicPaymentFieldsProps) {
  const formaPagamento = useWatch({ control, name: "forma_pagamento" });
  const tipoChavePix = useWatch({ control, name: "pix_tipo" });
  const { errors } = useFormState({ control });

  function aplicarMascaraCelular(v: string) {
    let digitos = v.replace(/\D/g, "").substring(0, 11);
    digitos = digitos.replace(/^(\d{2})(\d)/g, "($1) $2");
    digitos = digitos.replace(/(\d{5})(\d)/, "$1-$2");
    return digitos;
  }

  function cleanDigits(v: string) {
    return (v || "").replace(/\D/g, "");
  }

  function isPixKeyComplete(value: string, tipo: string) {
    const raw = value.trim();
    const digits = cleanDigits(raw);

    switch (tipo) {
      case "cnpj_cpf":
        return digits.length === 11 || digits.length === 14;
      case "celular":
        return digits.length === 11;
      case "email":
        return raw.includes("@") && raw.length >= 6;
      case "aleatoria":
        return raw.length >= 36;
      case "copia_cola":
        return raw.length >= 20;
      default:
        return false;
    }
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
              <>
                <select
                  {...field}
                  id="select-forma-pagamento"
                  value={field.value ?? ""}
                >
                  <option value="">Selecione</option>
                  <option value="boleto">Boleto</option>
                  <option value="pix">PIX</option>
                  <option value="transferencia">Transferência (TED/DOC)</option>
                  <option value="link_pagamento">Link de Pagamento</option>
                  <option value="cartao_credito">Cartão de Crédito</option>
                  <option value="dinheiro">Dinheiro</option>
                </select>
                {errors.forma_pagamento && (
                  <S.ErrorMessage>
                    <S.ErrorIcon size={14} />
                    {errors.forma_pagamento.message}
                  </S.ErrorMessage>
                )}
              </>
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
              <>
                <input
                  id="input-valor"
                  type="text"
                  placeholder="R$ 0,00"
                  name={field.name}
                  value={aplicarMascaraMoeda(field.value ?? "")}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
                {errors.valor && (
                  <S.ErrorMessage>
                    <S.ErrorIcon size={14} />
                    {errors.valor.message}
                  </S.ErrorMessage>
                )}
              </>
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
              render={({ field, fieldState: { error } }) => (
                <>
                  <input
                    id="input-link-pagamento"
                    type="url"
                    placeholder="https://link.operadora.com.br/sua-cobranca..."
                    name={field.name}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                  {error && (
                    <S.ErrorMessage>
                      <S.ErrorIcon size={14} /> {error.message}
                    </S.ErrorMessage>
                  )}
                </>
              )}
            />
          </S.InputGroup>
        </S.BlocoDinamicoAnimado>
      )}

      {formaPagamento === "pix" && (
        <S.BlocoDinamicoAnimado>
          <S.GridPix>
            <S.FullWidthGridItem>
              <S.InputGroup>
                <label htmlFor="pix-nome-favorecido">Nome do Favorecido</label>
                <Controller
                  name="ted_favorecido"
                  control={control}
                  defaultValue=""
                  rules={{ required: "O nome do favorecido é obrigatório." }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <input
                        id="pix-nome-favorecido"
                        type="text"
                        placeholder="Nome completo"
                        name={field.name}
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                      />
                      {error && (
                        <S.ErrorMessage>
                          <S.ErrorIcon size={14} /> {error.message}
                        </S.ErrorMessage>
                      )}
                    </>
                  )}
                />
              </S.InputGroup>
            </S.FullWidthGridItem>

            <S.InputGroup>
              <label htmlFor="select-tipo-pix">Tipo de Chave</label>
              <Controller
                name="pix_tipo"
                control={control}
                defaultValue="cnpj_cpf"
                render={({ field }) => (
                  <select
                    {...field}
                    id="select-tipo-pix"
                    value={field.value ?? "cnpj_cpf"}
                  >
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
                    const raw = v.trim();
                    const digits = cleanDigits(raw);

                    if (tipoChavePix === "cnpj_cpf") {
                      if (digits.length === 0) return true;
                      if (digits.length === 11 || digits.length === 14)
                        return true;
                      return digits.length < 11
                        ? "CPF ou CNPJ incompleto."
                        : "CPF ou CNPJ inválido.";
                    }

                    if (tipoChavePix === "celular") {
                      if (!isPixKeyComplete(raw, tipoChavePix)) return true;
                      return REGEX_TELEFONE.test(raw)
                        ? true
                        : "Telefone incompleto.";
                    }

                    if (tipoChavePix === "email") {
                      if (!isPixKeyComplete(raw, tipoChavePix)) return true;
                      return REGEX_EMAIL.test(raw) ? true : "E-mail inválido.";
                    }

                    if (tipoChavePix === "aleatoria") {
                      return raw.length >= 36 || "Chave aleatória incompleta.";
                    }

                    if (tipoChavePix === "copia_cola") {
                      return raw.length >= 20 || "Copia e cola incompleta.";
                    }

                    return true;
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      id="input-chave-pix"
                      type="text"
                      placeholder={obterPlaceholderPix()}
                      name={field.name}
                      value={
                        tipoChavePix === "cnpj_cpf"
                          ? aplicarCpfCnpj(field.value ?? "")
                          : tipoChavePix === "celular"
                            ? aplicarMascaraCelular(field.value ?? "")
                            : (field.value ?? "")
                      }
                      onChange={(e) =>
                        field.onChange(
                          tipoChavePix === "cnpj_cpf"
                            ? aplicarCpfCnpj(e.target.value)
                            : tipoChavePix === "celular"
                              ? aplicarMascaraCelular(e.target.value)
                              : e.target.value,
                        )
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {error && (
                      <S.ErrorMessage>
                        <S.ErrorIcon size={14} /> {error.message}
                      </S.ErrorMessage>
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
                    id="ted-banco"
                    type="text"
                    placeholder="Ex: Itaú"
                    name={field.name}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
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
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      id="ted-agencia"
                      type="text"
                      placeholder="0001"
                      name={field.name}
                      value={
                        field.value?.replace(/\D/g, "").substring(0, 4) || ""
                      }
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.replace(/\D/g, "").substring(0, 4),
                        )
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {error && (
                      <S.ErrorMessage>
                        <S.ErrorIcon size={14} /> {error.message}
                      </S.ErrorMessage>
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
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      id="ted-conta"
                      type="text"
                      placeholder="12345-6"
                      name={field.name}
                      value={(() => {
                        let v = (field.value ?? "").replace(/\D/g, "");
                        if (v.length > 1)
                          v = v.replace(/(\d+)(\d{1})$/, "$1-$2");
                        return v;
                      })()}
                      onChange={(e) => field.onChange(e.target.value)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {error && (
                      <S.ErrorMessage>
                        <S.ErrorIcon size={14} /> {error.message}
                      </S.ErrorMessage>
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
                      id="ted-favorecido-doc"
                      type="text"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      name={field.name}
                      value={aplicarCpfCnpj(field.value ?? "")}
                      onChange={(e) =>
                        field.onChange(aplicarCpfCnpj(e.target.value))
                      }
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {error && (
                      <S.ErrorMessage>
                        <S.ErrorIcon size={14} /> {error.message}
                      </S.ErrorMessage>
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
                rules={{ required: "O nome do favorecido é obrigatório." }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <input
                      id="ted-nome-titular"
                      type="text"
                      placeholder="Nome completo"
                      name={field.name}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                    {error && (
                      <S.ErrorMessage>
                        <S.ErrorIcon size={14} /> {error.message}
                      </S.ErrorMessage>
                    )}
                  </>
                )}
              />
            </S.InputGroup>
          </S.GridTedLinhaDois>
        </S.BlocoDinamicoAnimado>
      )}
    </>
  );
});
