import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

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

const PUBLIC_VAPID_KEY = import.meta.env.VITE_PUBLIC_VAPID_KEY;

export function useSincronizarDispositivoPush(userId: string | undefined) {
  
  // 🎯 EVOLUÇÃO DA TRAVA: Agora guarda o endpoint E o userId que sincronizou por último nesta sessão
  const ultimaSincronizacao = useRef<{ endpoint: string; userId: string } | null>(null);

  useEffect(() => {
    if (!userId || !("serviceWorker" in navigator) || !("Notification" in window)) return;

    let isCurrentRequestActive = true;

    const sincronizarForcado = async () => {
      try {
        if (Notification.permission !== "granted") {
          console.log("ℹ️ [SINC] Permissão de notificação não concedida ainda. Ignorando sincronização.");
          return;
        }

        const registrations = await navigator.serviceWorker.getRegistrations();
        const activeReg = registrations.find(r => r.active && r.active.scriptURL.includes("sw.js"));

        if (!activeReg) {
          console.log("⚠️ [SINC] Service Worker ativo não localizado para sincronização.");
          return;
        }

        const existingSubscription = await activeReg.pushManager.getSubscription();
        
        let subscription = existingSubscription;

        if (!subscription) {
          console.log("🔄 [SINC] Gerando nova inscrição de push diretamente no Service Worker...");
          subscription = await activeReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY || ""),
          });
        }

        const subJson = subscription.toJSON();

        if (!subJson.endpoint) {
          console.warn("⚠️ [SINC] Endpoint de push inválido gerado pelo navegador.");
          return;
        }

        // 🎯 O SEGREDO AQUI: Só bloqueia o loop se for o MESMO endpoint E o MESMO usuário.
        // Se o endpoint for igual mas o usuário mudou, ele ignora o return e executa a limpeza abaixo!
        if (
          ultimaSincronizacao.current?.endpoint === subJson.endpoint &&
          ultimaSincronizacao.current?.userId === userId
        ) {
          return;
        }

        if (!isCurrentRequestActive) return;

        console.log("🔄 [SINC] Renovando/Buscando token de push diretamente no Service Worker...");
        console.log(`🗑️ [SINC] Removendo vínculos anteriores deste dispositivo...`);
        
        // Remove de forma absoluta qualquer registro antigo com este endpoint (limpando o usuário antigo)
        await supabase
          .from("push_subscriptions")
          .delete()
          .eq("endpoint", subJson.endpoint);

        if (!isCurrentRequestActive) return;

        console.log(`🎯 [SINC] Criando novo vínculo definitivo para o usuário atual: ${userId}`);
        const { error } = await supabase
          .from("push_subscriptions")
          .insert([
            {
              user_id: userId,
              endpoint: subJson.endpoint,
              p256dh: subJson.keys?.p256dh,
              auth: subJson.keys?.auth,
            }
          ]);

        if (error) {
          console.error("❌ [SINC] Erro crítico ao sincronizar no Supabase:", error.message);
        } else {
          // 🎯 Atualiza a referência com o par correto de dados
          ultimaSincronizacao.current = { endpoint: subJson.endpoint, userId };
          console.log("💾 [SINC] Dispositivo sincronizado com sucesso absoluto!");
        }
      } catch (error) {
        console.error("❌ [SINC ERROR] Falha na sincronização agressiva:", error);
      }
    };

    sincronizarForcado();

    return () => {
      isCurrentRequestActive = false;
    };
  }, [userId]);
}