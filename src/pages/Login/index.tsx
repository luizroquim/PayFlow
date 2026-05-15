import { useState } from "react";
import { supabase } from "../../lib/supabase"; 
import { useNavigate } from "react-router-dom";

import * as S from "./styles"; 

export function Login() {
  const [nome, setNome] = useState(""); // Novo estado para o nome
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [carregando, setCarregando] = useState(false);
  
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password: senha,
        });
        if (error) throw error;
        navigate("/dashboard");
      } else {
        // Enviando o nome para o campo 'full_name' do User Metadata
        const { error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            data: {
              full_name: nome,
            }
          }
        });
        
        if (error) throw error;
        
        alert("Conta criada com sucesso! Agora você pode entrar.");
        setIsLogin(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert("Erro: " + error.message);
      } else {
        alert("Ocorreu um erro inesperado.");
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
          
            
            <div className="logo-text"><div className="Pay">PAY</div> <div className="Flow">FLOW</div></div>
            <span>SISTEMA DE SOLICITAÇÃO DE PAGAMENTOS</span>
         

          </div>
        </S.Header>

        <S.TabSelector>
          <S.TabButton 
            active={isLogin} 
            onClick={() => setIsLogin(true)}
            type="button"
          >
            Entrar
          </S.TabButton>
          <S.TabButton 
            active={!isLogin} 
            onClick={() => setIsLogin(false)}
            type="button"
          >
            Cadastrar
          </S.TabButton>
        </S.TabSelector>

        <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: "20px" }}>
          {isLogin ? "Acesse sua conta para continuar" : "Crie sua conta "}
        </p>

        <S.Form onSubmit={handleSubmit}>
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
            {carregando ? "Aguarde..." : (isLogin ? "Acessar Plataforma" : "Criar Conta")}
          </S.ActionButton>
        </S.Form>
        <h3>Desenvolvido por Luiz Phelipe</h3>
      </S.LoginCard>

      
    </S.Container>
  );

  
}

