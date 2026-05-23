import { memo } from "react";
import { Controller, useFormState, useWatch } from "react-hook-form";
import type { Control } from "react-hook-form";
import * as S from "./styles";
import {
  aplicarCpfCnpj,
  aplicarMascaraMoeda,
} from "../../../../utils/formatters";
import type { FormInputs } from "../NewRequest/types";

// 🎯 IMPORTAÇÃO DO NOSSO DESIGN SYSTEM CENTRALIZADO
import { Input, Select } from "../UI/index";

interface DynamicPaymentFieldsProps {
  control: Control<FormInputs>;
}

const REGEX_CPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const REGEX_CNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const REGEX_TELEFONE = /^\(\d{2}\)\s\d{5}-\d{4}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        {/* 🎯 SELECT INTELIGENTE: FORMA PAGAMENTO */}
        <Controller
          name="forma_pagamento"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Select
              label="Forma de Pagamento"
              {...field}
              id="select-forma-pagamento"
              value={field.value ?? ""}
              error={errors.forma_pagamento?.message}
            >
              <option value="">Selecione</option>
              <option value="boleto">Boleto</option>
              <option value="pix">PIX</option>
              <option value="transferencia">Transferência (TED/DOC)</option>
              <option value="link_pagamento">Link de Pagamento</option>
              <option value="cartao_credito">Cartão de Crédito</option>
              <option value="dinheiro">Dinheiro</option>
            </Select>
          )}
        />

        <Controller
          name="valor"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              id="input-valor"
              label="Valor (R$)"
              type="text"
              placeholder="R$ 0,00"
              name={field.name}
              value={aplicarMascaraMoeda(field.value ?? "")}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              ref={field.ref}
              error={errors.valor?.message}
            />
          )}
        />
      </S.GridDuplo>

      {formaPagamento === "link_pagamento" && (
        <S.BlocoDinamicoAnimado>
          <Controller
            name="pix_chave"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <Input
                id="input-link-pagamento"
                label="URL do Link de Pagamento"
                type="url"
                placeholder="https://link.operadora.com.br/sua-cobranca..."
                name={field.name}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                error={error?.message}
              />
            )}
          />
        </S.BlocoDinamicoAnimado>
      )}

      {formaPagamento === "pix" && (
        <S.BlocoDinamicoAnimado>
          <S.GridPix>
            <S.FullWidthGridItem>
              <Controller
                name="ted_favorecido"
                control={control}
                defaultValue=""
                rules={{ required: "O nome do favorecido é obrigatório." }}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    id="pix-nome-favorecido"
                    label="Nome do Favorecido"
                    type="text"
                    placeholder="Nome completo"
                    name={field.name}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    error={error?.message}
                  />
                )}
              />
            </S.FullWidthGridItem>

            {/* 🎯 SELECT INTELIGENTE: TIPO CHAVE */}
            <Controller
              name="pix_tipo"
              control={control}
              defaultValue="cnpj_cpf"
              render={({ field }) => (
                <Select
                  label="Tipo de Chave"
                  {...field}
                  id="select-tipo-pix"
                  value={field.value ?? "cnpj_cpf"}
                >
                  <option value="cnpj_cpf">CPF / CNPJ</option>
                  <option value="celular">Celular</option>
                  <option value="email">E-mail</option>
                  <option value="aleatoria">Aleatória</option>
                  <option value="copia_cola">Copia e Cola</option>
                </Select>
              )}
            />

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
                <Input
                  id="input-chave-pix"
                  label={
                    tipoChavePix === "copia_cola"
                      ? "Código Copia e Cola"
                      : "Chave PIX"
                  }
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
                  error={error?.message}
                />
              )}
            />
          </S.GridPix>
        </S.BlocoDinamicoAnimado>
      )}

     {formaPagamento === "transferencia" && (
        <S.BlocoDinamicoAnimado>
          <S.GridTedLinhaUm>
            <Controller
              name="ted_banco"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="ted-banco"
                  label="Banco"
                  type="text"
                  placeholder="Ex: Itaú"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="ted_agencia"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="ted-agencia"
                  label="Ag."
                  type="text"
                  placeholder="0001"
                  name={field.name}
                  value={field.value?.replace(/\D/g, "").substring(0, 4) || ""}
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").substring(0, 4))}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="ted_conta"
              control={control}
              defaultValue=""
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="ted-conta"
                  label="Conta Corrente"
                  type="text"
                  placeholder="12345-6"
                  name={field.name}
                  value={(() => {
                    let v = (field.value ?? "").replace(/\D/g, "");
                    if (v.length > 1) v = v.replace(/(\d+)(\d{1})$/, "$1-$2");
                    return v;
                  })()}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  error={error?.message}
                />
              )}
            />
          </S.GridTedLinhaUm>

          <S.GridTedLinhaDois>
            {/* AQUI ELES SÃO USADOS E O AVISO DO ESLINT SUMIRÁ */}
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
                <Input
                  id="ted-favorecido-doc"
                  label="CPF/CNPJ Favorecido"
                  type="text"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  name={field.name}
                  value={aplicarCpfCnpj(field.value ?? "")}
                  onChange={(e) => field.onChange(aplicarCpfCnpj(e.target.value))}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="ted_favorecido"
              control={control}
              defaultValue=""
              rules={{ required: "O nome do favorecido é obrigatório." }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="ted-nome-titular"
                  label="Nome do Favorecido / Titular"
                  type="text"
                  placeholder="Nome completo"
                  name={field.name}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  error={error?.message}
                />
              )}
            />
          </S.GridTedLinhaDois>
        </S.BlocoDinamicoAnimado>
      )}
    </>
  );
});