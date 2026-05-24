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

// Garanta que sua chave pública VAPID real está aqui
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

      // 🏢 ESTRATÉGIA 1: Tenta ler o Service Worker injetado pelo Vite PWA
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        activeRegistration = registrations[0];
      }

      // 🛠️ ESTRATÉGIA 2 (FALLBACK): Se o PWA estiver em cache ou offline, registra um escopo genérico
      if (!activeRegistration) {
        console.log(
          "Injetando fallback de Service Worker para o ambiente local...",
        );
        // O próprio Vite PWA gera um arquivo chamado sw.js ou registerSW.js no build.
        // Vamos registrar diretamente a rota padrão do PWA para destravar o PushManager.
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

      // 🔑 Gera o token criptográfico de inscrição
      const subscription = await activeRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
      });

      return subscription;
    } catch (error) {
      // 🎯 TIPAGEM SEGURA PARA O TS: Garante que o erro é um objeto de Erro do JS
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";
      console.error("Erro no fluxo de push:", error);
      alert(`Erro ao ativar: ${errorMessage}`);
      return null;
    }
  };

  return { solicitarPermissaoEInscrever };
}
