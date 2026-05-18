import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import emailjs from '@emailjs/browser';
import { registerSW } from 'virtual:pwa-register'; // 🚀 Importado com sucesso

// 🏁 Inicializações do app (Roda uma vez antes de renderizar a tela)
emailjs.init("6i9UszG5Qr_Afz3zi");
registerSW({ immediate: true }); // 🎯 Movido para cá: Registra o PWA imediatamente

// ✨ Renderização do React na tela
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);