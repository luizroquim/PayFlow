// src/pages/Login/ResetPassword.tsx (ou index.tsx correspondente)
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import conta from "../../assets/conta.png";

import { Button } from "../../features/requests/components/UI";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "./resetPasswordSchema";
import * as S from "./styles";

export function ResetPassword() {
  const [carregando, setCarregando] = useState(false);
  const [erroBackend, setErroBackend] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      novaSenha: "",
      confirmarSenha: "",
    },
  });

  async function onSubmitReset(data: ResetPasswordFormData) {
    setCarregando(true);
    setErroBackend(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.novaSenha,
      });

      if (error) throw error;

      setSucesso(true);

      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErroBackend(error.message);
      } else {
        setErroBackend(
          "Ocorreu um erro ao atualizar sua senha. Tente novamente.",
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  // Função para mandar o usuário de volta para a raiz de login de forma segura
  const alternarParaLoginPrincipal = () => {
    navigate("/");
  };

  return (
    <S.Container>
      <S.LoginCard>
        <S.Header>
          <div className="logo-placeholder">
            <div className="logo-text">
              <img src={conta} alt="Logo" />
              <div className="Pay">Pay</div> <div className="Flow">Flow</div>
            </div>
            <span>SISTEMA DE SOLICITAÇÃO DE PAGAMENTOS</span>
          </div>
        </S.Header>

        {sucesso ? (
          <S.SuccessMessage>
            <div className="icon-box">✓</div>
            <h4>Senha atualizada!</h4>
            <p>
              Sua nova senha foi salva com sucesso. Redirecionando para a tela
              de acesso...
            </p>
          </S.SuccessMessage>
        ) : (
          <>
            <p
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                marginBottom: "20px",
              }}
            >
              Crie uma nova senha segura para a sua conta
            </p>

            <S.Form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(onSubmitReset)(e);
              }}
              noValidate
            >
              {erroBackend && <S.ErrorMessage>{erroBackend}</S.ErrorMessage>}

              <label htmlFor="new-password">Nova Senha</label>
              <S.Input
                id="new-password"
                type="password"
                placeholder="No mínimo 6 caracteres"
                {...register("novaSenha")}
              />
              {errors.novaSenha && (
                <S.FieldError>
                  <AlertCircle size={14} />
                  <span>{errors.novaSenha.message}</span>
                </S.FieldError>
              )}

              <label htmlFor="confirm-password">Confirmar Nova Senha</label>
              <S.Input
                id="confirm-password"
                type="password"
                placeholder="Digite a senha novamente"
                {...register("confirmarSenha")}
              />
              {errors.confirmarSenha && (
                <S.FieldError>
                  <AlertCircle size={14} />
                  <span>{errors.confirmarSenha.message}</span>
                </S.FieldError>
              )}

              <Button
                type="submit"
                isLoading={carregando}
                onClick={handleSubmit(onSubmitReset)}
                style={{ marginTop: "4px", width: "100%" }}
              >
                Atualizar Senha
              </Button>

              <Button
                variant="ghost"
                type="button"
                onClick={alternarParaLoginPrincipal}
                style={{ marginTop: "12px", width: "100%" }}
              >
                Voltar para o Login
              </Button>
            </S.Form>
          </>
        )}

        <h3>Desenvolvido por Luiz Phelipe</h3>
      </S.LoginCard>
    </S.Container>
  );
}
