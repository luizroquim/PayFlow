import { useState } from "react";
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import conta from "../../assets/conta.png";

import * as S from "./styles";

export function Login() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucessoCadastro, setSucessoCadastro] = useState(false);

  // Estados para controlar o fluxo de "Esqueci minha senha"
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [sucessoResetEmail, setSucessoResetEmail] = useState(false);

  const navigate = useNavigate();

  // Detecta o e-mail de reset de senha vindo do Supabase e redireciona
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      navigate(`/reset-password${hash}`);
    }
  }, [navigate]);

  // Função que envia o e-mail de recuperação automaticamente
  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        // Redireciona o usuário de volta para o ambiente correto (Local ou Vercel)
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSucessoResetEmail(true);
      setEmail("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Erro ao enviar e-mail de recuperação.");
      }
    } finally {
      setCarregando(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });

        if (error) {
          if (error.message === "Invalid login credentials") {
            setErro("E-mail ou senha incorretos. Verifique os dados e tente novamente.");
          } else {
            setErro(error.message);
          }
          return;
        }

        navigate("/dashboard");
      } else {
        // Fluxo de Cadastro
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            data: {
              full_name: nome.trim(),
            },
          },
        });

        if (error) {
          setErro("Erro ao criar conta: " + error.message);
          return;
        }

        setSucessoCadastro(true);
        setNome("");
        setEmail("");
        setSenha("");

        setTimeout(() => {
          setSucessoCadastro(false);
          setIsLogin(true);
        }, 5000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <S.Container>
      <S.LoginCard>
        <S.Header>
          <div className="logo-placeholder">
            <div className="logo-text">
              <img src={conta} alt="" />
              <div className="Pay">Pay</div> <div className="Flow">Flow</div>
            </div>
            <span>SISTEMA DE SOLICITAÇÃO DE PAGAMENTOS</span>
          </div>
        </S.Header>

        {/* 1️⃣ TELA A: Fluxo de Esqueci Minha Senha */}
        {isForgotPassword ? (
          <>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px" }}>
              Recuperação de Senha
            </p>

            {sucessoResetEmail ? (
              <S.SuccessMessage>
                <div className="icon-box">✓</div>
                <h4>E-mail enviado!</h4>
                <p>Verifique sua caixa de entrada para obter o link de redefinição de senha.</p>
                <S.ActionButton 
                  type="button" 
                  style={{ marginTop: "20px" }}
                  onClick={() => {
                    setIsForgotPassword(false);
                    setSucessoResetEmail(false);
                  }}
                >
                  Voltar para o Login
                </S.ActionButton>
              </S.SuccessMessage>
            ) : (
              <S.Form onSubmit={handleForgotPassword}>
                {erro && <S.ErrorMessage>{erro}</S.ErrorMessage>}
                
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "10px", textAlign: "center" }}>
                  Insira o e-mail da sua conta para receber o link de redefinição.
                </p>

                <label htmlFor="reset-email">Seu e-mail</label>
                <S.Input
                  id="reset-email"
                  type="email"
                  placeholder="exemplo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <S.ActionButton type="submit" disabled={carregando}>
                  {carregando ? "Enviando..." : "Enviar Link de Recuperação"}
                </S.ActionButton>

                <S.BackToLoginButton
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setErro(null);
                  }}
                >
                  Voltar para o Login
                </S.BackToLoginButton>
              </S.Form>
            )}
          </>
        ) : (
          /* 2️⃣ TELA B: Fluxo Normal de Login / Cadastro */
          <>
            {!sucessoCadastro && (
              <S.TabSelector>
                <S.TabButton
                  active={isLogin}
                  onClick={() => {
                    setIsLogin(true);
                    setErro(null);
                  }}
                  type="button"
                >
                  Entrar
                </S.TabButton>
                <S.TabButton
                  active={!isLogin}
                  onClick={() => {
                    setIsLogin(false);
                    setErro(null);
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
                <p>Sua conta foi registrada no PayFlow. Redirecionando você para a tela de acesso...</p>
              </S.SuccessMessage>
            ) : (
              <>
                <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px" }}>
                  {isLogin ? "Acesse sua conta para continuar" : "Crie sua conta "}
                </p>

                <S.Form onSubmit={handleSubmit}>
                  {erro && <S.ErrorMessage>{erro}</S.ErrorMessage>}

                  {!isLogin && (
                    <>
                      <label htmlFor="nome">Nome completo</label>
                      <S.Input
                        id="nome"
                        type="text"
                        placeholder="Seu nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                      />
                    </>
                  )}

                  <label htmlFor="email">Seu e-mail</label>
                  <S.Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />

                  <label htmlFor="password">Sua senha</label>
                  <S.Input
                    id="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />

                  {isLogin && (
                    <S.ForgotPasswordLink
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setErro(null);
                        setEmail("");
                      }}
                    >
                      Esqueceu sua senha?
                    </S.ForgotPasswordLink>
                  )}

                  <S.ActionButton type="submit" disabled={carregando}>
                    {carregando
                      ? "Aguarde..."
                      : isLogin
                        ? "Acessar Plataforma"
                        : "Criar Conta"}
                  </S.ActionButton>
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