// public/sw.js

// 🎧 Ouve o sinal de Push vindo do servidor (Google FCM/Supabase)
self.addEventListener('push', (event) => {
  let data = { title: 'Sistema de Compras', body: 'Nova atualização disponível!' };
  
  if (event.data) {
    try {
      // Tenta ler o JSON enviado pela nossa Edge Function
      data = event.data.json();
    } catch (e) {
      // Caso venha como texto simples, usa como corpo
      data = { title: 'Sistema de Compras', body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/icon-192x192.png', // Ícone que aparece na notificação
    badge: '/badge.png', // Ícone menor para a barra de status
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    }
  };

  // 🔥 Renderiza o balão de notificação nativo do sistema operacional
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 🖱️ Define o que acontece quando o usuário clica na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Fecha o balão da tela
  
  // Abre o sistema automaticamente ou foca na aba que já está aberta
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes('localhost') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});