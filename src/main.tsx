import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import emailjs from "@emailjs/browser";

// 🏁 Inicializações do app (Roda uma vez antes de renderizar a tela)
emailjs.init("6i9UszG5Qr_Afz3zi");

/* 🎯 NOTA SÊNIOR: 
  O registro do Service Worker agora é feito de forma 100% automatizada e dinâmica 
  pelo ecossistema do Vite PWA Plugin e pelos seus hooks customizados (usando o /sw.js).
  O bloco manual do 'push-sw.js' foi removido para extinguir o erro de MIME type do console.
*/

// ✨ Renderização do React na tela
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
