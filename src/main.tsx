import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import emailjs from '@emailjs/browser';
import { registerSW } from 'virtual:pwa-register';

// 🏁 Inicializações do app
emailjs.init("6i9UszG5Qr_Afz3zi");

// 1. Registra o PWA padrão do Vite (Para funcionamento offline)
registerSW({ immediate: true });

// 2. Registra o SEU Service Worker exclusivo para as Notificações Push (SEGURO)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/push-sw.js')
      .then(reg => console.log('🟢 Service Worker do Push registrado com sucesso!', reg.scope))
      .catch(err => console.error('🔴 Falha ao registrar Service Worker do Push:', err));
  });
}

// ✨ Renderização do React
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);