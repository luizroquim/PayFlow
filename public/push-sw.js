// public/push-sw.js

// 🎧 Ouve o sinal de Push vindo do servidor (Google FCM / Supabase Edge Function)
self.addEventListener("push", (event) => {
  // Mensagem padrão "coringa" caso o payload venha vazio
  let data = {
    title: "🛒 Sistema de Compras",
    body: "Nova movimentação no seu painel!",
  };

  if (event.data) {
    try {
      // Tenta ler o JSON customizado enviado pela Edge Function (titulo e status)
      data = event.data.json();
    } catch (e) {
      // Caso venha como texto simples por algum motivo, joga no corpo da notificação
      data = {
        title: "🛒 Sistema de Compras",
        body: event.data.text(),
      };
    }
  }

  // Configurações visuais do balão nativo do Sistema Operacional
  const options = {
    body: data.body,
    icon: data.icon || "/favicon.ico", // 🎯 Ajustado para usar o seu favicon.ico da pasta public
    badge: "/favicon.ico", // 🎯 Ícone menor de status ajustado para o favicon.ico
    vibrate: [100, 50, 100], // Padrão de vibração para dispositivos móveis
    data: {
      dateOfArrival: Date.now(),
      primaryKey: "1",
    },
  };

  // 🔥 Força o Service Worker a manter a thread viva até desenhar a notificação na tela
  event.waitUntil(self.registration.showNotification(data.title, options));
});

// 🖱️ Define a ação de clique do usuário em cima do balão de notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close(); // Fecha o balão imediatamente da tela após o clique

  // Mapeia as abas abertas para focar no sistema ou abrir uma nova aba
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windowClients) => {
        // Percorre as abas do navegador que estão abertas
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];

          // 🟢 Inteligente: Foca na aba se for localhost OU se for o link da sua Vercel
          const urlValida =
            client.url.includes("localhost") ||
            client.url.includes("vercel.app");

          if (urlValida && "focus" in client) {
            return client.focus(); // Traz a aba existente para a frente da tela
          }
        }

        // Se o sistema não estava aberto em nenhuma aba, abre uma nova na raiz do projeto
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      }),
  );
});
