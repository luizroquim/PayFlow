// src/components/Login/loginSchema.ts
import * as yup from "yup";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 1. Definimos o tipo exato que o React Hook Form e o seu formulário esperam
export interface LoginFormData {
  modo: "login" | "cadastro" | "recuperacao";
  email: string;
  nome?: string;  // 🎯 Opcional com '?' para o Hook Form ficar feliz
  senha?: string; // 🎯 Opcional com '?' para o Hook Form ficar feliz
}

// 2. Forçamos o Yup a construir um schema que valide exatamente essa interface
export const loginSchema: yup.ObjectSchema<LoginFormData> = yup.object({
  modo: yup
    .string()
    .oneOf(["login", "cadastro", "recuperacao"] as const)
    .required(),
  
  nome: yup
    .string()
    .trim()
    .when("modo", {
      is: "cadastro",
      then: (schema) => schema.required("O nome completo é obrigatório.").min(3, "Insira um nome válido (mínimo 3 letras)."),
      otherwise: (schema) => schema.notRequired().strip(), // strip() remove o campo do objeto final se não for cadastro
    }),
  
  email: yup
    .string()
    .trim()
    .required("O e-mail é obrigatório.")
    .matches(REGEX_EMAIL, "Insira um formato de e-mail válido."),
    
  senha: yup
    .string()
    .when("modo", {
      is: (modo: string) => modo === "login" || modo === "cadastro",
      then: (schema) => schema.required("A senha é obrigatória.").min(6, "A senha deve ter pelo menos 6 caracteres."),
      otherwise: (schema) => schema.notRequired().strip(),
    }),
}) as yup.ObjectSchema<LoginFormData>; 
