// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import emailjs from '@emailjs/browser';
// 🔴 Comentado temporariamente para desarmar o PWA que causava o loop de reload
// import { registerSW } from 'virtual:pwa-register';

// 🏁 Inicializações do app (Roda uma vez antes de renderizar a tela)
emailjs.init("6i9UszG5Qr_Afz3zi");

// 🔴 Comentado para impedir reloads infinitos na Vercel:
// registerSW({ immediate: true });

// 🟢 MANTIDO: Registro limpo e isolado do seu Service Worker de Push (Não causa reloads)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/push-sw.js')
      .then(reg => console.log('🟢 Service Worker do Push registrado com sucesso!', reg.scope))
      .catch(err => console.error('🔴 Falha ao registrar Service Worker do Push:', err));
  });
}

// ✨ Renderização do React na tela
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);