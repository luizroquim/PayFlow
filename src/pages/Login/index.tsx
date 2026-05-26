// src/components/Login/index.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import conta from "../../assets/conta.png";

// Seu componente global integrado
import { Button } from "../../features/requests/components/UI";

import { loginSchema, type LoginFormData } from "./loginSchema";
import * as S from "./styles";

export function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erroBackend, setErroBackend] = useState<string | null>(null);

  const [sucessoCadastro, setSucessoCadastro] = useState(false);
  const [sucessoResetEmail, setSucessoResetEmail] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      modo: "login",
      nome: "",
      email: "",
      senha: "",
    },
  });

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      navigate(`/reset-password${hash}`);
    }
  }, [navigate]);

  const onSubmitForm = async (data: LoginFormData) => {
    setCarregando(true);
    setErroBackend(null);

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(
          data.email.trim(),
          {
            redirectTo: `${window.location.origin}/reset-password`,
          },
        );

        if (error) throw error;
        setSucessoResetEmail(true);
        reset();
      } else if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email.trim(),
          password: data.senha || "",
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            setErroBackend("E-mail ou senha incorretos. Verifique os dados.");
          } else {
            setErroBackend(error.message);
          }
          return;
        }
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email.trim(),
          password: data.senha || "",
          options: {
            data: {
              full_name: data.nome?.trim(),
            },
          },
        });

        if (error) {
          setErroBackend("Erro ao criar conta: " + error.message);
          return;
        }

        setSucessoCadastro(true);
        reset();

        setTimeout(() => {
          setSucessoCadastro(false);
          setIsLogin(true);
        }, 5000);
      }
    } catch (error: unknown) {
      setErroBackend(
        error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
      );
    } finally {
      setCarregando(false);
    }
  };

  const alternarParaLoginPrincipal = () => {
    setIsForgotPassword(false);
    setSucessoResetEmail(false);
    setIsLogin(true);
    reset();
    setValue("modo", "login");
    setErroBackend(null);
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

        {erroBackend && <S.ErrorMessage>{erroBackend}</S.ErrorMessage>}

        {isForgotPassword ? (
          <>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px" }}>
              Recuperação de Senha
            </p>

            {sucessoResetEmail ? (
              <S.SuccessMessage>
                <div className="icon-box">✓</div>
                <h4>E-mail enviado!</h4>
                <p>Verifique sua caixa de entrada para obter o link de redefinição.</p>
                
                <Button
                  type="button"
                  style={{ marginTop: "20px", width: "100%", backgroundColor: "#079cdc" }}
                  onClick={alternarParaLoginPrincipal}
                >
                  Voltar para o Login
                </Button>
              </S.SuccessMessage>
            ) : (
              <S.Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmitForm)(e);
                }}
                noValidate
              >
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "15px", textAlign: "center" }}>
                  Insira o e-mail da sua conta para receber o link de redefinição.
                </p>

                <label htmlFor="reset-email">Seu e-mail</label>
                <S.Input
                  id="reset-email"
                  type="email"
                  placeholder="exemplo@email.com"
                  {...register("email")}
                />
                {errors.email && (
                  <S.FieldError>
                    <AlertCircle size={14} />
                    <span>{errors.email.message}</span>
                  </S.FieldError>
                )}

                {/* 🎯 CORRIGIDO: Retornado para a cor azul original (#079cdc) */}
                <Button
                  type="submit"
                  isLoading={carregando}
                  onClick={handleSubmit(onSubmitForm)}
                  style={{ width: "100%", backgroundColor: "#079cdc" }}
                >
                  Enviar Link de Recuperação
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
            )}
          </>
        ) : (
          <>
            {!sucessoCadastro && (
              <S.TabSelector>
                <S.TabButton
                  active={isLogin}
                  onClick={() => {
                    setIsLogin(true);
                    setMostrarSenha(false);
                    setValue("modo", "login");
                    setErroBackend(null);
                  }}
                  type="button"
                >
                  Entrar
                </S.TabButton>
                <S.TabButton
                  active={!isLogin}
                  onClick={() => {
                    setIsLogin(false);
                    setMostrarSenha(false);
                    setValue("modo", "cadastro");
                    setErroBackend(null);
                  }}
                  type="button"
                >
                  Cadastrar
                </S.TabButton>
              </S.TabSelector>
            )}

            {sucessoCadastro ? (
              <S.SuccessMessage>
                <div className="icon-box">✓</div>
                <h4>Conta criada com sucesso!</h4>
                <p>Sua conta foi registrada no PayFlow. Redirecionando...</p>
              </S.SuccessMessage>
            ) : (
              <>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px" }}>
                  {isLogin ? "Acesse sua conta para continuar" : "Crie sua conta"}
                </p>

                <S.Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(onSubmitForm)(e);
                  }}
                  noValidate
                >
                  {!isLogin && (
                    <>
                      <label htmlFor="nome">Nome completo</label>
                      <S.Input
                        id="nome"
                        type="text"
                        placeholder="Seu nome"
                        {...register("nome")}
                      />
                      {errors.nome && (
                        <S.FieldError>
                          <AlertCircle size={14} />
                          <span>{errors.nome.message}</span>
                        </S.FieldError>
                      )}
                    </>
                  )}

                  <label htmlFor="email">Seu e-mail</label>
                  <S.Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <S.FieldError>
                      <AlertCircle size={14} />
                      <span>{errors.email.message}</span>
                    </S.FieldError>
                  )}

                  <label htmlFor="password">Sua senha</label>
                  <div style={{ position: "relative", width: "100%" }}>
                    <S.Input
                      id="password"
                      type={mostrarSenha ? "text" : "password"}
                      placeholder="Digite sua senha"
                      style={{ paddingRight: "40px" }}
                      {...register("senha")}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#94a3b8",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.senha && (
                    <S.FieldError>
                      <AlertCircle size={14} />
                      <span>{errors.senha.message}</span>
                    </S.FieldError>
                  )}

                  {isLogin && (
                    <S.ForgotPasswordLink
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setValue("modo", "recuperacao");
                        setErroBackend(null);
                      }}
                    >
                      Esqueceu sua senha?
                    </S.ForgotPasswordLink>
                  )}

                  {/* 🎯 CORRIGIDO: Retornado para a cor azul original (#079cdc) */}
                  <Button
                    type="submit"
                    isLoading={carregando}
                    onClick={handleSubmit(onSubmitForm)}
                    style={{ width: "100%", backgroundColor: "#079cdc" }}
                  >
                    {isLogin ? "Acessar Plataforma" : "Criar Conta"}
                  </Button>
                </S.Form>
              </>
            )}
          </>
        )}

        <h3>Desenvolvido por Luiz Phelipe</h3>
      </S.LoginCard>
    </S.Container>
  );
}