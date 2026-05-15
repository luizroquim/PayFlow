
interface FiltrosProps {
  valor: string;
  setValor: (valor: string) => void;
  placeholder?: string;
}

export function Filtros({ valor, setValor, placeholder }: FiltrosProps) {
  return (
    <div style={{ position: "relative", marginBottom: "24px" }}>
      {/* Ícone opcional para um visual mais moderno */}
      <div style={{
        position: "absolute",
        left: "14px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#94a3b8",
        pointerEvents: "none"
      }}>
        🔍
      </div>

      <input
        type="text"
        placeholder={placeholder || "Pesquisar por título ou solicitante..."}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        style={{
          width: "100%",
          padding: "12px 16px 12px 42px", // Espaço extra na esquerda para o ícone
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          backgroundColor: "#fff",
          fontSize: "0.95rem",
          outline: "none",
          transition: "all 0.2s ease-in-out",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}
        // Efeito de destaque ao clicar no campo
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "#0284c7";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(2, 132, 199, 0.1)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
        }}
      />
    </div>
  );
}