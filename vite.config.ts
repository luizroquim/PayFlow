import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // 🚀 Importa o plugin

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Atualiza o app automaticamente quando você subir versão nova
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "maskable-icon.png",
      ],
      manifest: {
        id: "/", // 🎯 Define o ID único do aplicativo requisitado pelo navegador
        name: "PayFlow - Gestão de Pagamentos",
        short_name: "PayFlow",
        description:
          "Sistema inteligente para gestão de solicitações de compras e pagamentos",
        theme_color: "#0284c7", // Cor da barra do sistema no celular (Azul escuro)
        background_color: "#ffffff", // Cor de fundo da tela de splash
        display: "standalone", // Roda em tela cheia, sem barra de navegador
        orientation: "portrait",
        lang: 'pt-BR',
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable", // Garante que o ícone fique bonito em qualquer formato de botão no Android
          },
          {
            src: "favicon.ico",
            sizes: "32x32 16x16", // Definido nos tamanhos reais do arquivo .ico
            type: "image/x-icon",
            purpose: "any",
          },
        ],
        /* 🎯 screenshots removidas para evitar imagens distorcidas na instalação */
      },
    }),
  ],
});