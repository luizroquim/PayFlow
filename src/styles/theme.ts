export const theme = {
  colors: {
    // 🎯 Cores originais do ecossistema interno do sistema
    primary: "#0284c7",
    primaryHover: "#079cdc",
    primaryFocusShadow: "rgba(2, 132, 199, 0.1)",

    // 🔐 Cores exclusivas para os botões da tela de Login
    loginAction: "#079cdc",       /* O azul vivo do .Flow e das abas ativas */
    loginActionHover: "#0582b7",  /* O tom mais escuro perfeito para o hover do login */

    // 🔴 Centralização total das cores da caixa de ERRO (ErrorMessage)
    errorBackground: "#fef2f2",   /* Fundo vermelho bem suave */
    errorBorder: "#fee2e2",       /* Borda sutil do erro */
    errorText: "#ef4444",         /* Texto vermelho de atenção */

    // 🟢 Centralização total das cores da caixa de SUCESSO (SuccessMessage)
    successBackground: "#f0fdf4", /* Fundo verde bem suave */
    successBorder: "#bbf7d0",     /* Borda sutil do sucesso */
    successText: "#166534",       /* Texto verde principal */
    successIconBox: "#dcfce7",    /* Fundo da bolinha do ícone de ✓ */
    successIcon: "#15803d",       /* Cor do ícone de ✓ */

    // 💙 Centralização da cor dos alertas azuis do React Hook Form + Yup (FieldError)
    fieldErrorText: "#079cdc",    /* Azul oficial para os erros de validação abaixo do input */

    // Outras cores base do seu sistema
    success: "#10b981",
    successHover: "#059669",
    danger: "#ef4444",
    dangerHover: "#dc2626",
    secondary: "#fdfdfd",
    secondaryBorder: "#c5c5c5",
    textTitle: "#0f172a",
    textMain: "#1e293b",
    textSecondary: "#475569",
    background: "#ffffff",
    backgroundLight: "#fdfdfd",
    backgroundHover: "#f8fafc",
    border: "#cbd5e1",
    disabled: "#cbd5e1",
    white: "#ffffff",
  },

  fonts: {
    sizes: {
      small: "0.8rem",
      label: "0.85rem",
      body: "0.95rem",
      title: "1.3rem",
    },
    weights: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
  },

  radii: {
    default: "8px",
    medium: "12px",
  },

  transitions: {
    fast: "all 0.2s",
    smooth: "all 0.2s ease-in-out",
  },
} as const;