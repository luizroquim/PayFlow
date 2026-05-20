import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      // 🎯 Mapeia apenas os arquivos reais que estão no seu print:
      includeAssets: ["favicon.ico", "maskable-icon.png"], 
      manifest: {
        id: "/",
        name: "PayFlow - Gestão de Pagamentos",
        short_name: "PayFlow",
        description:
          "Sistema inteligente para gestão de solicitações de compras e pagamentos",
        theme_color: "#0284c7",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        lang: 'pt-BR',
        start_url: "/",
        icons: [
          {
            src: "favicon.ico",
            sizes: "32x32 16x16",
            type: "image/x-icon",
            purpose: "any",
          },
          {
            // 🚀 O arquivo da sua pasta mapeado corretamente no tamanho padrão de alta resolução
            src: "maskable-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable", 
          },
        ],
      },
    }),
  ],
});