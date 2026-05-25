// src/hooks/useSincronizarDispositivoPush.ts
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

// Função utilitária para converter a chave VAPID
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

const PUBLIC_VAPID_KEY = "BDYPSXzHRoR5Ohbn63OMR5XVX_BCqknfPN96jCYjYPSnf2yEMiCVaSrxojvQaRnxYsmEIM4xM60iCoEX9tgwa2k";

export function useSincronizarDispositivoPush(userId: string | undefined) {
  useEffect(() => {
    if (!userId || !("serviceWorker" in navigator) || !("Notification" in window)) return;

    const sincronizarForcado = async () => {
      try {
        // 1. Só rodamos a sincronização automática se a permissão nativa já for 'granted'
        if (Notification.permission !== "granted") {
          console.log("ℹ️ [SINC] Permissão de notificação não concedida ainda. Ignorando sincronização silenciosa.");
          return;
        }

        const registrations = await navigator.serviceWorker.getRegistrations();
        const activeReg = registrations.find(r => r.active && r.active.scriptURL.includes("sw.js"));

        if (!activeReg) {
          console.log("⚠️ [SINC] Service Worker ativo não localizado para sincronização.");
          return;
        }

        // 2. 🔥 O PULO DO GATO: Forçamos uma nova inscrição (subscribe) direto no Worker ativo.
        // Se o token antigo estivesse em cache ou bugado, o pushManager.subscribe() renova e limpa o cache local na hora!
        console.log("🔄 [SINC] Renovando/Buscando token de push diretamente no Service Worker...");
        const subscription = await activeReg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),
        });

        const subJson = subscription.toJSON();

        console.log(`🎯 [SINC] Forçando UPSERT definitivo no banco para o usuário atual: ${userId}`);
        
        // 3. Registra ou atualiza no Supabase
        const { error } = await supabase
          .from("push_subscriptions")
          .upsert(
            {
              user_id: userId,
              endpoint: subJson.endpoint,
              p256dh: subJson.keys?.p256dh,
              auth: subJson.keys?.auth,
            },
            { onConflict: "endpoint" }
          );

        if (error) {
          console.error("❌ [SINC] Erro ao atualizar no Supabase:", error.message);
        } else {
          console.log("💾 [SINC] Sincronização executada com sucesso absoluto!");
        }
      } catch (error) {
        console.error("❌ [SINC ERROR] Falha na sincronização agressiva:", error);
      }
    };

    sincronizarForcado();
  }, [userId]); // Executa toda vez que o ID do usuário mudar no login
}