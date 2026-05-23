import "styled-components";

export const theme = {
  colors: {
    primary: "#0284c7",
    primaryHover: "#079cdc",
    primaryFocusShadow: "rgba(2, 132, 199, 0.1)",
    textTitle: "#0f172a",
    textMain: "#1e293b",
    textSecondary: "#475569",
    background: "#ffffff",
    backgroundLight: "#fdfdfd",
    backgroundHover: "#f8fafc",
    border: "#cbd5e1",
    disabled: "#94a3b8",
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
  },
  transitions: {
    fast: "all 0.2s",
    smooth: "all 0.2s ease-in-out",
  },
} as const;

// Pegamos o tipo automático do nosso objeto theme
export type ThemeType = typeof theme;

// Sobrescrevemos o Styled-Components de forma explícita para o Linter não reclamar
declare module "styled-components" {
  export interface DefaultTheme {
    colors: ThemeType["colors"];
    fonts: ThemeType["fonts"];
    radii: ThemeType["radii"];
    transitions: ThemeType["transitions"];
  }
}