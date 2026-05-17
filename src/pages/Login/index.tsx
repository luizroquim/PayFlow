import { useState } from "react";
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

  // 🎯 1. NOVO ESTADO: Controla a exibição da tela de sucesso temporária
  const [sucessoCadastro, setSucessoCadastro] = useState(false);

  const navigate = useNavigate();

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
            setErro(
              "E-mail ou senha incorretos. Verifique os dados e tente novamente.",
            );
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

        // 🎯 2. GATILHO DE SUCESSO: Ativa a tela verde de sucesso e limpa os campos
        setSucessoCadastro(true);
        setNome("");
        setEmail("");
        setSenha("");

        // Aguarda 3.5 segundos mostrando a mensagem e depois joga o usuário para o Login
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

        {/* Esconde o seletor de abas se o sucesso estiver ativo para focar na mensagem */}
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

        {/* 🎯 3. COMPORTAMENTO CONDICIONAL: Mostra Sucesso OU mostra o Formulário */}
        {sucessoCadastro ? (
          <S.SuccessMessage>
            <div className="icon-box">✓</div>
            <h4>Conta criada com sucesso!</h4>
            <p>
              Sua conta foi registrada no PayFlow. Redirecionando você para a
              tela de acesso...
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
              {isLogin ? "Acesse sua conta para continuar" : "Crie sua conta "}
            </p>

            <S.Form onSubmit={handleSubmit}>
              {erro && <S.ErrorMessage>{erro}</S.ErrorMessage>}

              {/* Campo de Nome aparece apenas no cadastro */}
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

        <h3>Desenvolvido por Luiz Phelipe</h3>
      </S.LoginCard>
    </S.Container>
  );
}
