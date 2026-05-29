import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";

// ==========================================
// 🚀 ACELERAÇÃO E ATUALIZAÇÃO DO PWA
// ==========================================

// 🎯 Força o novo Service Worker a pular a espera e se instalar imediatamente
self.skipWaiting();

// 🎯 Faz o novo SW assumir o controle de todas as abas abertas de forma instantânea
clientsClaim();

// 🧹 Deleta caches de builds antigos da Vercel para liberar espaço e evitar conflitos
cleanupOutdatedCaches();

// 📦 O Vite PWA precisa dessa linha para injetar o cache e ativar o botão de instalar
precacheAndRoute(self.__WB_MANIFEST || []);

// 🔄 Escuta o comando manual de atualização caso venha de algum componente front-end
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// ==========================================
// 🎧 GESTÃO DE NOTIFICAÇÕES PUSH (SEU CÓDIGO)
// ==========================================

// Ouve o sinal de Push vindo do servidor (Google FCM / Supabase Edge Function)
self.addEventListener("push", (event) => {
  let data = {
    title: "Sistema de Pagamentos",
    body: "Nova movimentação no seu painel!",
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = {
        title: "Sistema de Pagamentos",
        body: event.data.text(),
      };
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "/favicon.ico",
    badge: "/favicon.ico",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "1",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ==========================================
// 🖱️ COMPORTAMENTO DE CLIQUE NA NOTIFICAÇÃO
// ==========================================

// Define a ação de clique do usuário em cima do balão de notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];

          const urlValida =
            client.url.includes("localhost") ||
            client.url.includes("vercel.app");

          if (urlValida && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      }),
  );
});
