import * as yup from "yup";
import type { FormInputs } from "./types";

const REGEX_CPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const REGEX_CNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanDigits(value?: string) {
  return (value || "").replace(/\D/g, "");
}

const optionalString = yup
  .string()
  .nullable()
  .transform((value, originalValue) => (originalValue === "" ? null : value))
  .notRequired();

export const newRequestSchema: yup.ObjectSchema<FormInputs> = yup.object({
  titulo: yup.string().trim().required("O título é obrigatório."),
  descricao: yup.string().trim().required("A descrição é obrigatória."),
  link_compra: optionalString.url("Informe uma URL válida."),
  forma_pagamento: optionalString.test(
    "forma-valid",
    "Selecione uma forma válida de pagamento.",
    (value) =>
      !value ||
      [
        "boleto",
        "pix",
        "transferencia",
        "link_pagamento",
        "cartao_credito",
        "dinheiro",
      ].includes(value),
  ),
  valor: optionalString,
  pix_tipo: yup
    .string()
    .oneOf(["cnpj_cpf", "celular", "email", "aleatoria", "copia_cola"])
    .required(),
  pix_chave: optionalString.when("forma_pagamento", {
    is: (value: string) => value === "pix" || value === "link_pagamento",
    then: (schema) =>
      schema
        .required("A chave é obrigatória.")
        .test("pix-dinamico", "Chave PIX inválida.", function (value) {
          const pixTipo = this.parent.pix_tipo;
          if (!value) return false;
          const trimmed = value.trim();
          const digits = cleanDigits(trimmed);

          if (pixTipo === "cnpj_cpf")
            return digits.length === 11 || digits.length === 14;
          if (pixTipo === "celular") return digits.length === 11;
          if (pixTipo === "email") return REGEX_EMAIL.test(trimmed);
          if (pixTipo === "aleatoria") return trimmed.length === 36;
          if (pixTipo === "copia_cola") return trimmed.length >= 20;
          return true;
        }),
    otherwise: (schema) => schema,
  }),
  ted_banco: optionalString.when("forma_pagamento", {
    is: "transferencia",
    then: (schema) => schema.required("O banco é obrigatório."),
  }),
  ted_agencia: optionalString.when("forma_pagamento", {
    is: "transferencia",
    then: (schema) =>
      schema
        .required("A agência é obrigatória.")
        .matches(/^\d{4}$/, "Agência inválida (4 dígitos)."),
  }),
  ted_conta: optionalString.when("forma_pagamento", {
    is: "transferencia",
    then: (schema) => schema.required("A conta é obrigatória."),
  }),
  ted_cpf_cnpj: optionalString.when("forma_pagamento", {
    is: "transferencia",
    then: (schema) =>
      schema
        .required("CPF ou CNPJ é obrigatório.")
        .test(
          "cpf-cnpj-valid",
          "CPF ou CNPJ inválido.",
          (value) =>
            !!value && (REGEX_CPF.test(value) || REGEX_CNPJ.test(value)),
        ),
  }),
  ted_favorecido: optionalString.when("forma_pagamento", {
    is: (value: string) => value === "transferencia" || value === "pix",
    then: (schema) => schema.required("O nome do favorecido é obrigatório."),
  }),
  boleto_file: yup.mixed<File>().nullable().notRequired(),
  anexo_existente_url: optionalString,
  is_submitting: yup.boolean().required(),
});
