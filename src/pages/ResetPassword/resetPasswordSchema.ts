// src/pages/Login/resetPasswordSchema.ts
import * as yup from "yup";

export interface ResetPasswordFormData {
  novaSenha: string;
  confirmarSenha: string;
}

export const resetPasswordSchema: yup.ObjectSchema<ResetPasswordFormData> = yup.object({
  novaSenha: yup
    .string()
    .required("A nova senha é obrigatória.")
    .min(6, "A senha deve ter pelo menos 6 caracteres."),
    
  confirmarSenha: yup
    .string()
    .required("A confirmação de senha é obrigatória.")
    .oneOf([yup.ref("novaSenha")], "As senhas não coincidem. Verifique e tente novamente."),
}) as yup.ObjectSchema<ResetPasswordFormData>;