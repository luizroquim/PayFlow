// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa"; // 🚀 Importa o plugin

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest", // 🟢 ADICIONADO: Avisa que vamos usar nosso próprio sw.js
      srcDir: "src",                // 🟢 ADICIONADO: Pasta onde vai ficar o arquivo sw.js
      filename: "sw.js",            // 🟢 ADICIONADO: Nome do arquivo de origem
      registerType: "autoUpdate",   // Mantém a atualização automática ativa de forma segura
      devOptions: {
        enabled: true,
        type: 'module'
      },
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "maskable-icon.png",
      ],
      manifest: {
        id: "/", // 🎯 FIX: Define o ID único do aplicativo requisitado pelo navegador
        name: "PayFlow - Gestão de Pagamentos",
        short_name: "PayFlow",
        description:
          "Sistema inteligente para gestão de solicitações de compras e pagamentos",
        theme_color: "#0284c7", // Cor da barra do sistema no celular (Azul escuro)
        background_color: "#ffffff", // Cor de fundo da tela de splash
        display: "standalone", // Roda em tela cheia, sem barra de navegador
        orientation: "portrait",
        lang: "pt-BR",
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
            sizes: "64x64 32x32 24x24 16x16 144x144 512x512",
            type: "image/x-icon",
            purpose: "any",
          },
        ],
        screenshots: [
          {
            src: "favicon.ico", // Provisório: Depois substitua por um print real da sua Dashboard em formato PC
            sizes: "512x512",
            type: "image/x-icon",
            form_factor: "wide", // 🖥️ Versão Desktop
            label: "Painel Principal do PayFlow",
          },
          {
            src: "favicon.ico", // Provisório: Depois substitua por um print da tela em formato Celular
            sizes: "512x512",
            type: "image/x-icon",
            form_factor: "narrow", // 📱 Versão Mobile
            label: "Acesse suas solicitações de qualquer lugar",
          },
        ],
      },
    }),
  ],
});