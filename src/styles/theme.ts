export const theme = {
  colors: {
    primary: "#0284c7",
    primaryHover: "#079cdc",
    primaryFocusShadow: "rgba(2, 132, 199, 0.1)",

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