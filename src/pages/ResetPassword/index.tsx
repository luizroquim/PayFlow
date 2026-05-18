import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import conta from "../../assets/conta.png";

import * as S from "./styles";

export function ResetPassword() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  const navigate = useNavigate();

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    // Validação básica de tamanho de senha padrão do Supabase
    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      setCarregando(false);
      return;
    }

    // Validação de igualdade
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem. Verifique e tente novamente.");
      setCarregando(false);
      return;
    }

    try {
      // 🎯 O Supabase identifica o usuário automaticamente através do token que veio no link do e-mail
      const { error } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (error) throw error;

      setSucesso(true);
      setNovaSenha("");
      setConfirmarSenha("");

      // Aguarda 4 segundos exibindo a animação de sucesso e joga para a tela de login
      setTimeout(() => {
        navigate("/"); // Redireciona para a raiz (sua tela de login)
      }, 4000);

    } catch (error: unknown) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Ocorreu um erro ao atualizar sua senha. Tente novamente.");
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

        {sucesso ? (
          <S.SuccessMessage>
            <div className="icon-box">✓</div>
            <h4>Senha atualizada!</h4>
            <p>Sua nova senha foi salva com sucesso. Redirecionando para a tela de acesso...</p>
          </S.SuccessMessage>
        ) : (
          <>
            <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px" }}>
              Crie uma nova senha segura para a sua conta
            </p>

            <S.Form onSubmit={handleResetPassword}>
              {erro && <S.ErrorMessage>{erro}</S.ErrorMessage>}

              <label htmlFor="new-password">Nova Senha</label>
              <S.Input
                id="new-password"
                type="password"
                placeholder="No mínimo 6 caracteres"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />

              <label htmlFor="confirm-password">Confirmar Nova Senha</label>
              <S.Input
                id="confirm-password"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />

              <S.ActionButton type="submit" disabled={carregando}>
                {carregando ? "Salvando nova senha..." : "Atualizar Senha"}
              </S.ActionButton>
            </S.Form>
          </>
        )}

        <h3>
          Desenvolvido por Luiz Phelipe
        </h3>
      </S.LoginCard>
    </S.Container>
  );
}