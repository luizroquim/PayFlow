import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState(""); // Novo estado para o nome
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre Login e Cadastro
  const navigate = useNavigate();

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();

    if (isSignUp) {
      // 1. Criamos o usuário passando o nome no campo 'options'
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: nome, // Isso salva o nome dentro do Auth do Supabase
          },
        },
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.user) {
        // 2. Criamos o perfil vinculado ao ID do usuário
        const { error: perfilError } = await supabase.from("perfis").insert([
          {
            id: data.user.id,
            nome_completo: nome,
          },
        ]);

        if (perfilError) {
          console.error("Erro no perfil:", perfilError.message);
          // Se der erro aqui, pelo menos o usuário foi criado no Auth
        }

        alert("Cadastro realizado! Tente fazer login agora.");
        setIsSignUp(false); // Volta para a tela de login
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
      else navigate("/dashboard");
    }
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "400px",
        margin: "100px auto",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333" }}>
        {isSignUp ? "Criar nova conta" : "Acesse o Sistema"}
      </h2>

      <form
        onSubmit={handleAuth}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        {/* Campo Nome só aparece se for cadastro */}
        {isSignUp && (
          <input
            required
            type="text"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        )}

        <input
          required
          type="email"
          placeholder="Seu melhor e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
        <input
          required
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />

        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isSignUp ? "Cadastrar" : "Entrar"}
        </button>
      </form>

      <div
        style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9rem" }}
      >
        {isSignUp ? (
          <p>
            Já tem uma conta?{" "}
            <span
              onClick={() => setIsSignUp(false)}
              style={{
                color: "#007bff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Faça login
            </span>
          </p>
        ) : (
          <p>
            Não tem uma conta?{" "}
            <span
              onClick={() => setIsSignUp(true)}
              style={{
                color: "#007bff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Crie uma agora
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
