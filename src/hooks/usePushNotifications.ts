// src/hooks/usePushNotifications.ts

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Chave pública VAPID real do seu projeto
const PUBLIC_VAPID_KEY =
  "BDYPSXzHRoR5Ohbn63OMR5XVX_BCqknfPN96jCYjYPSnf2yEMiCVaSrxojvQaRnxYsmEIM4xM60iCoEX9tgwa2k";

export function usePushNotifications() {
  const solicitarPermissaoEInscrever = async () => {
    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Notificações Push não são suportadas neste navegador.");
        return null;
      }

      let activeRegistration: ServiceWorkerRegistration | null = null;

      // 🏢 ESTRATÉGIA 1: Busca o Service Worker unificado gerado pelo Vite PWA
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        // 🎯 AJUSTADO: Agora procura pelo 'sw.js' (que contém o PWA + as Notificações juntos)
        activeRegistration = registrations.find(reg => 
          reg.active && reg.active.scriptURL.includes('sw.js')
        ) || null;

        // Se não achou por nome, mas tem algum rodando, assume ele como plano B
        if (!activeRegistration) {
          activeRegistration = registrations[0];
        }
      }

      // 🛠️ ESTRATÉGIA 2 (FALLBACK): Se nenhum worker do PWA estiver ativo, registra o sw.js
      if (!activeRegistration) {
        console.log("Injetando o Service Worker unificado do PWA...");
        // 🎯 AJUSTADO: Mudado de '/push-sw.js' para '/sw.js'
        activeRegistration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
      }

      if (!activeRegistration) {
        throw new Error("Não foi possível mapear nenhum Service Worker ativo.");
      }

      // 🔔 Pede permissão nativa (Abre o pop-up no navegador)
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("Usuário recusou as notificações.");
        return null;
      }

      // 🔑 Gera o token criptográfico de inscrição usando o worker do PWA
      const subscription = await activeRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      return subscription;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro no fluxo de push:", error);
      alert(`Erro ao ativar: ${errorMessage}`);
      return null;
    }
  };

  return { solicitarPermissaoEInscrever };
}